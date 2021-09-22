import { pipeDebug } from '@bgap/shared/utils';
import { combineLatest, of } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';
import { deleteGeneratedProductsForAUnitFromDb } from '../product';
import { reGenerateActiveProductCategoriesForAUnit } from '../product-category';
import { toCreateGeneratedProductInputType } from '../product/calculate-product';
import { createGeneratedProductsInDb } from '../product/generated-product';
import {
  calculateAndFilterNotActiveProducts,
  getMergedProductsFromUnitProducts,
  getProductComponentMap,
  getProductComponentSetMap,
  getTimezoneForUnit,
  listUnitProductsForAUnit,
} from './regenerate-unit-data-utils';
import { RegenerateUnitDataHandler, UnitsResolverDeps } from './utils';

export const regenerateUnitData =
  (deps: UnitsResolverDeps): RegenerateUnitDataHandler =>
  (unitId: string) => {
    console.log(
      '### ~ file: REGENERATE-unit-data.resolver.ts 02 ~ line 36 ~ unitId',
      unitId,
    );

    // Clear previously generated products for the given UNIT
    return of(unitId).pipe(
      switchMap(deleteGeneratedProductsForAUnitFromDb(deps.crudSdk)),
      mapTo(unitId),
      switchMap(listUnitProductsForAUnit(deps)),
      switchMap(getMergedProductsFromUnitProducts(deps)),
      switchMap(mergedProducts =>
        combineLatest([
          getTimezoneForUnit(deps)(unitId),
          getProductComponentSetMap(deps)(mergedProducts[0].chainId), // all the unitProduct for the same unit has the same chainID
          getProductComponentMap(deps)(mergedProducts[0].chainId), // all the unitProduct for the same unit has the same chainID
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
        reGenerateActiveProductCategoriesForAUnit(deps)({
          unitId,
          generatedProducts: props.generatedProducts,
        }).pipe(pipeDebug('### REGENERATE-result')),
      ),
    );
  };
