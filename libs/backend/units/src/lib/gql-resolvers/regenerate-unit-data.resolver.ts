import { pipeDebug } from '@bgap/shared/utils';
import { combineLatest } from 'rxjs';
import { map, mapTo, shareReplay, switchMap, takeLast } from 'rxjs/operators';
import { reGenerateActiveProductCategoriesForAUnit } from '@bgap/backend/product-categories';
import {
  toCreateGeneratedProductInputType,
  createGeneratedProductsInDb,
  deleteGeneratedProductsItemsFromDb,
  listGeneratedProductsForUnits,
} from '@bgap/backend/products';
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
import * as R from 'ramda';

export const regenerateUnitData =
  (crudSdk: CrudApi.CrudSdk): RegenerateUnitDataHandler =>
  (unitId: string) => {
    console.log(
      '### ~ file: REGENERATE-unit-data.resolver.ts 02 ~ line 36 ~ unitId',
      unitId,
    );
    // Clear previously generated products for the given UNIT
    const calc1 = listUnitProductsForAUnit(crudSdk)(unitId).pipe(
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

    const listOriginalGeneratedProducts$ = listGeneratedProductsForUnits(
      crudSdk,
    )([unitId]).pipe(
      map(generatedProducts => generatedProducts.map(prop => prop.id)),
    );

    return combineLatest([listOriginalGeneratedProducts$, regenerate$]).pipe(
      map(([originalProducts, newProducts]) =>
        R.difference(originalProducts, newProducts),
      ),
      switchMap(deleteGeneratedProductsItemsFromDb),
      takeLast(1),
      mapTo(true),
    );
  };
