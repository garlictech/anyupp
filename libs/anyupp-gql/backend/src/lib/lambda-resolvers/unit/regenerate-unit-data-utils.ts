import * as CrudApi from '@bgap/crud-gql/api';
import { getAllPaginatedData } from '@bgap/gql-sdk';
import {
  MergedProduct,
  MergedProductWithPrices,
  ProductComponentMap,
  ProductComponentSetMap,
} from '@bgap/shared/types';
import {
  filterNullishGraphqlListWithDefault,
  getNoProductInUnitError,
  throwIfEmptyValue,
} from '@bgap/shared/utils';
import { from, Observable, of, throwError } from 'rxjs';
import { map, mergeMap, switchMap, toArray } from 'rxjs/operators';
import { getTimezoneFromLocation } from '../../utils';
import { calculateActualPricesAndCheckActivity } from '../product/calculate-product';
import { mergeAllProductLayers } from '../product/merge-product';
import { UnitsResolverDeps } from './utils';

export const calculateAndFilterNotActiveProducts = (
  inTimeZone: string,
  mergedProducts: Array<MergedProduct>,
) =>
  mergedProducts.reduce((prev, curr) => {
    const mergedProduct = calculateActualPricesAndCheckActivity({
      product: curr,
      atTimeISO: new Date().toISOString(),
      inTimeZone,
    });
    if (mergedProduct === undefined) {
      return prev;
    }
    return [...prev, mergedProduct];
  }, <MergedProductWithPrices[]>[]);

export const listUnitProductsForAUnit =
  (deps: UnitsResolverDeps) => (unitId: string) => {
    const input: CrudApi.SearchUnitProductsQueryVariables = {
      filter: { unitId: { eq: unitId } },
    };
    const throwOnEmptyList = (items: CrudApi.UnitProduct[]) =>
      items.length > 0 ? of(items) : throwError(getNoProductInUnitError());

    return getAllPaginatedData(deps.crudSdk.SearchUnitProducts, {
      query: input,
      options: { fetchPolicy: 'no-cache' },
    }).pipe(
      filterNullishGraphqlListWithDefault<CrudApi.UnitProduct>([]),
      switchMap(throwOnEmptyList),
    );
  };

export const get3LayerFromAUnitProduct =
  (unitProduct: CrudApi.UnitProduct) =>
  (
    deps: UnitsResolverDeps,
  ): Observable<{
    chainProduct: CrudApi.ChainProduct;
    groupProduct: CrudApi.GroupProduct;
    unitProduct: CrudApi.UnitProduct;
  }> => {
    return from(
      deps.crudSdk.GetGroupProduct({ id: unitProduct.parentId }),
    ).pipe(
      throwIfEmptyValue<CrudApi.GroupProduct>(),
      switchMap(groupProduct =>
        from(deps.crudSdk.GetChainProduct({ id: groupProduct.parentId })).pipe(
          throwIfEmptyValue<CrudApi.ChainProduct>(),
          map(chainProduct => ({ unitProduct, groupProduct, chainProduct })),
        ),
      ),
    );
  };

export const getMergedProductsFromUnitProducts =
  (deps: UnitsResolverDeps) => (unitProducts: Array<CrudApi.UnitProduct>) =>
    from(unitProducts).pipe(
      mergeMap(unitProduct => get3LayerFromAUnitProduct(unitProduct)(deps), 2),
      map(productLayers => mergeAllProductLayers(productLayers)),
      toArray(),
    );

export const getTimezoneForUnit =
  (deps: UnitsResolverDeps) =>
  (unitId: string): Observable<string> =>
    from(deps.crudSdk.GetUnit({ id: unitId })).pipe(
      throwIfEmptyValue<CrudApi.Unit>(),

      map(unit => unit.address.location),
      map(getTimezoneFromLocation),
    );

export const getProductComponentSetMap =
  (deps: UnitsResolverDeps) =>
  (chainId: string): Observable<ProductComponentSetMap> => {
    const input: CrudApi.SearchProductComponentSetsQueryVariables = {
      filter: { chainId: { eq: chainId } },
    };

    return getAllPaginatedData(deps.crudSdk.SearchProductComponentSets, {
      query: input,
      options: { fetchPolicy: 'no-cache' },
    }).pipe(
      filterNullishGraphqlListWithDefault<CrudApi.ProductComponentSet>([]),
      map(prodCompSets =>
        prodCompSets.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {}),
      ),
    );
  };
export const getProductComponentMap =
  (deps: UnitsResolverDeps) =>
  (chainId: string): Observable<ProductComponentMap> => {
    const input: CrudApi.SearchProductComponentsQueryVariables = {
      filter: { chainId: { eq: chainId } },
    };
    return getAllPaginatedData(deps.crudSdk.SearchProductComponents, {
      query: input,
      options: { fetchPolicy: 'no-cache' },
    }).pipe(
      filterNullishGraphqlListWithDefault<CrudApi.ProductComponent>([]),
      map(prodComps =>
        prodComps.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {}),
      ),
    );
  };
