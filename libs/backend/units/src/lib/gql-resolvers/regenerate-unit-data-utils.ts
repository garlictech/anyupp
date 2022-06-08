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
import {
  mergeAllProductLayers,
  calculateActualPricesAndCheckActivity,
} from '@bgap/backend/products';
import {
  ChainProduct,
  GroupProduct,
  ProductComponent,
  ProductComponentSet,
  SearchProductComponentSetsQueryVariables,
  SearchProductComponentsQueryVariables,
  SearchUnitProductsQueryVariables,
  Unit,
  UnitProduct,
} from '@bgap/domain';
import { CrudSdk } from '@bgap/crud-gql/api';

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
  (crudSdk: CrudSdk) => (unitId: string) => {
    const input: SearchUnitProductsQueryVariables = {
      filter: {
        unitId: { eq: unitId },
        dirty: { ne: true },
        deletedAt: { exists: false },
      },
    };
    const throwOnEmptyList = (items: UnitProduct[]) =>
      items.length > 0 ? of(items) : throwError(getNoProductInUnitError());

    return getAllPaginatedData(crudSdk.SearchUnitProducts, {
      query: input,
      options: { fetchPolicy: 'no-cache' },
    }).pipe(
      filterNullishGraphqlListWithDefault<UnitProduct>([]),
      switchMap(throwOnEmptyList),
    );
  };

export const get3LayerFromAUnitProduct =
  (unitProduct: UnitProduct) =>
  (
    crudSdk: CrudSdk,
  ): Observable<{
    chainProduct: ChainProduct;
    groupProduct: GroupProduct;
    unitProduct: UnitProduct;
  }> => {
    return from(crudSdk.GetGroupProduct({ id: unitProduct.parentId })).pipe(
      throwIfEmptyValue<GroupProduct>(),
      switchMap(groupProduct =>
        from(crudSdk.GetChainProduct({ id: groupProduct.parentId })).pipe(
          throwIfEmptyValue<ChainProduct>(),
          map(chainProduct => ({ unitProduct, groupProduct, chainProduct })),
        ),
      ),
    );
  };

export const getMergedProductsFromUnitProducts =
  (crudSdk: CrudSdk) => (unitProducts: Array<UnitProduct>) =>
    from(unitProducts).pipe(
      mergeMap(
        unitProduct => get3LayerFromAUnitProduct(unitProduct)(crudSdk),
        2,
      ),
      map(productLayers => mergeAllProductLayers(productLayers)),
      toArray(),
    );

export const getTimezoneForUnit =
  (crudSdk: CrudSdk) =>
  (unitId: string): Observable<string> =>
    from(crudSdk.GetUnit({ id: unitId })).pipe(
      throwIfEmptyValue<Unit>(),
      map(unit => unit.timeZone || 'Europe/Budapest'),
    );

export const getProductComponentSetMap =
  (crudSdk: CrudSdk) =>
  (chainId: string): Observable<ProductComponentSetMap> => {
    const input: SearchProductComponentSetsQueryVariables = {
      filter: { chainId: { eq: chainId }, deletedAt: { exists: false } },
    };

    return getAllPaginatedData(crudSdk.SearchProductComponentSets, {
      query: input,
      options: { fetchPolicy: 'no-cache' },
    }).pipe(
      filterNullishGraphqlListWithDefault<ProductComponentSet>([]),
      map(prodCompSets =>
        prodCompSets.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {}),
      ),
    );
  };
export const getProductComponentMap =
  (crudSdk: CrudSdk) =>
  (chainId: string): Observable<ProductComponentMap> => {
    const input: SearchProductComponentsQueryVariables = {
      filter: { chainId: { eq: chainId }, deletedAt: { exists: false } },
    };
    return getAllPaginatedData(crudSdk.SearchProductComponents, {
      query: input,
      options: { fetchPolicy: 'no-cache' },
    }).pipe(
      filterNullishGraphqlListWithDefault<ProductComponent>([]),
      map(prodComps =>
        prodComps.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {}),
      ),
    );
  };
