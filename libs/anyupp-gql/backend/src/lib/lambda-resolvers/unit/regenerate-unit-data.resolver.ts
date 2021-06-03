import { combineLatest, from, iif, Observable, of, throwError } from 'rxjs';
import { map, mapTo, switchMap } from 'rxjs/operators';

import * as CrudApi from '@bgap/crud-gql/api';
import {
  validateProductComponentList,
  validateProductComponentSetList,
  validateUnitProductList,
} from '@bgap/shared/data-validators';
import {
  ProductComponentMap,
  ProductComponentSetMap,
  ProductWithPrices,
} from '@bgap/shared/types';
import {
  filterNullish,
  filterNullishGraphqlListWithDefault,
  getNoProductInUnitgError,
} from '@bgap/shared/utils';

import { getTimezoneFromLocation } from '../../utils';
import { deleteGeneratedProductsForAUnit } from '../product';
import {
  calculateActualPricesAndCheckActivity,
  toCreateGeneratedProductInputType,
} from '../product/calculate-product';
import { createGeneratedProducts } from '../product/generated-product';
import { mergeAllProductLayers } from '../product/merge-product';
import { UnitsResolverDeps } from './utils';

export const regenerateUnitData = (unitId: string) => (
  deps: UnitsResolverDeps,
): Observable<boolean> => {
  // TODO: refactor: use mergeMap or something to flatten the pipe
  // Clear previously generated products for the given UNIT
  return deleteGeneratedProductsForAUnit(unitId)(deps).pipe(
    switchMap(() =>
      // list all unitProducts+groupProducts+chainProducts for the given UNIT
      listProductsWith3LayerForAUnit(unitId)(deps),
    ),
    switchMap(unitProducts =>
      combineLatest([
        of(
          unitProducts.map(unitProduct => {
            return mergeAllProductLayers({
              chainProduct: unitProduct.groupProduct.chainProduct,
              groupProduct: unitProduct.groupProduct,
              unitProduct,
            });
          }),
        ),
        getTimezoneForUnit(unitId)(deps),
        getProductComponentSetMap(unitProducts[0].chainId)(deps), // all the unitProduct for the same unit has the same chainID
        getProductComponentMap(unitProducts[0].chainId)(deps), // all the unitProduct for the same unit has the same chainID
      ]).pipe(
        // calculate actual Prize for all the mergedProducts
        map(
          ([
            mergedProducts,
            unitTimeZone,
            productComponentSetMap,
            productComponentMap,
          ]) => ({
            mergedProducts,
            unitTimeZone,
            productComponentSetMap,
            productComponentMap,
          }),
        ),
        map(props => ({
          ...props,
          products: props.mergedProducts.reduce((prev, curr) => {
            const mergedProduct = calculateActualPricesAndCheckActivity({
              product: curr,
              atTimeISO: new Date().toISOString(),
              inTimeZone: props.unitTimeZone,
            });
            if (mergedProduct === undefined) {
              return prev;
            }
            return [...prev, mergedProduct];
          }, <ProductWithPrices[]>[]),
        })),
        map(props => {
          return props.products.map(product =>
            toCreateGeneratedProductInputType({
              product,
              unitId: unitProducts[0].unitId,
              productComponentSetMap: props.productComponentSetMap,
              productComponentMap: props.productComponentMap,
              productConfigSets: product.configSets,
            }),
          );
        }),
      ),
    ),
    // store generatedProducts in the db
    switchMap(createGeneratedProducts),
    mapTo(true),
  );
};

const listProductsWith3LayerForAUnit = (unitId: string) => (
  deps: UnitsResolverDeps,
) => {
  const input: CrudApi.ListUnitProductsQueryVariables = {
    filter: { unitId: { eq: unitId } },
  };

  return from(
    deps.crudSdk.ListUnitProducts(input, { fetchPolicy: 'no-cache' }),
  ).pipe(
    switchMap(validateUnitProductList),
    filterNullishGraphqlListWithDefault<CrudApi.UnitProduct>([]),
    switchMap(items =>
      iif(
        () => items.length > 0,
        of(items),
        throwError(getNoProductInUnitgError()),
      ),
    ),
  );
};

const getTimezoneForUnit = (unitId: string) => (
  deps: UnitsResolverDeps,
): Observable<string> =>
  from(deps.crudSdk.GetUnit({ id: unitId })).pipe(
    map(unit => unit?.address?.location),
    filterNullish(),
    map(getTimezoneFromLocation),
  );

const getProductComponentSetMap = (chainId: string) => (
  deps: UnitsResolverDeps,
): Observable<ProductComponentSetMap> => {
  const input: CrudApi.ListProductComponentSetsQueryVariables = {
    filter: { chainId: { eq: chainId } },
  };

  return from(
    deps.crudSdk.ListProductComponentSets(input, { fetchPolicy: 'no-cache' }),
  ).pipe(
    switchMap(validateProductComponentSetList),
    filterNullishGraphqlListWithDefault<CrudApi.ProductComponentSet>([]),
    map(prodCompSets =>
      prodCompSets.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {}),
    ),
  );
};
const getProductComponentMap = (chainId: string) => (
  deps: UnitsResolverDeps,
): Observable<ProductComponentMap> => {
  const input: CrudApi.ListProductComponentsQueryVariables = {
    filter: { chainId: { eq: chainId } },
  };
  return from(
    deps.crudSdk.ListProductComponents(input, { fetchPolicy: 'no-cache' }),
  ).pipe(
    switchMap(validateProductComponentList),
    filterNullishGraphqlListWithDefault<CrudApi.ProductComponent>([]),
    map(prodComps =>
      prodComps.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {}),
    ),
  );
};
