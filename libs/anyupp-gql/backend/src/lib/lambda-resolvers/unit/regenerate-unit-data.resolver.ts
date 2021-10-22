import { pipeDebug } from '@bgap/shared/utils';
import { combineLatest, merge } from 'rxjs';
import {
  delayWhen,
  map,
  mapTo,
  shareReplay,
  switchMap,
  takeLast,
  tap,
} from 'rxjs/operators';
import { reGenerateActiveProductCategoriesForAUnit } from '../product-category';
import { toCreateGeneratedProductInputType } from '../product/calculate-product';
import {
  createGeneratedProductsInDb,
  deleteGeneratedProductsItemsFromDb,
  listGeneratedProductsForUnits,
} from '../product/generated-product';
import {
  calculateAndFilterNotActiveProducts,
  getMergedProductsFromUnitProducts,
  getProductComponentMap,
  getProductComponentSetMap,
  getTimezoneForUnit,
  listUnitProductsForAUnit,
} from './regenerate-unit-data-utils';
import { RegenerateUnitDataHandler } from './utils';
import * as CrudApi from '@bgap/crud-gql/api';

export const regenerateUnitData =
  (crudSdk: CrudApi.CrudSdk): RegenerateUnitDataHandler =>
  (unitId: string) => {
    console.log(
      '### ~ file: REGENERATE-unit-data.resolver.ts 02 ~ line 36 ~ unitId',
      unitId,
    );

    // Clear previously generated products for the given UNIT
    const calc1 = listUnitProductsForAUnit(crudSdk)(unitId).pipe(
      tap(x => console.warn('*****listUnitProductsForAUnit on op', x)),
      switchMap(getMergedProductsFromUnitProducts(crudSdk)),
      switchMap(mergedProducts =>
        combineLatest([
          getTimezoneForUnit(crudSdk)(unitId),
          getProductComponentSetMap(crudSdk)(mergedProducts[0].chainId), // all the unitProduct for the same unit has the same chainID
          getProductComponentMap(crudSdk)(mergedProducts[0].chainId), // all the unitProduct for the same unit has the same chainID
        ]).pipe(
          map(
            ([unitTimeZone, productComponentSetMap, productComponentMap]) => ({
              unitTimeZone,
              productComponentSetMap,
              productComponentMap,
              mergedProducts,
            }),
          ),
        ),
      ),
      map(props => ({
        ...props,
        products: calculateAndFilterNotActiveProducts(
          // calculate actual Prize for all the mergedProducts
          props.unitTimeZone,
          props.mergedProducts,
        ),
      })),
    );

    const regenerate$ = calc1.pipe(
      map(props => ({
        ...props,
        generatedProducts: props.products.map(product =>
          toCreateGeneratedProductInputType({
            product,
            unitId,
            productComponentSetMap: props.productComponentSetMap,
            productComponentMap: props.productComponentMap,
            productConfigSets: product.configSets,
          }),
        ),
      })),
      switchMap(props =>
        createGeneratedProductsInDb(props.generatedProducts).pipe(mapTo(props)),
      ),
      switchMap(props =>
        reGenerateActiveProductCategoriesForAUnit({ crudSdk })({
          unitId,
          generatedProducts: props.generatedProducts,
        }).pipe(pipeDebug('### REGENERATE-result')),
      ),
      shareReplay(1),
    );

    const deleteOldGenProds$ = listGeneratedProductsForUnits(crudSdk)([
      unitId,
    ]).pipe(
      tap(x => console.warn('eleteOldGenProds$', x)),
      delayWhen(() => regenerate$),
      tap(x => console.warn('eleteOldGenProds$ 2', x)),
      switchMap(deleteGeneratedProductsItemsFromDb),
    );

    return merge(regenerate$, deleteOldGenProds$).pipe(
      takeLast(1),
      mapTo(true),
    );
  };
