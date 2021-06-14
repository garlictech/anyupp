import { combineLatest, from, iif, Observable, of, throwError } from 'rxjs';
import { map, mapTo, mergeMap, switchMap, toArray } from 'rxjs/operators';

import * as CrudApi from '@bgap/crud-gql/api';
import {
  validateChainProduct,
  validateGroupProduct,
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
import { deleteGeneratedProductsForAUnitFromDb } from '../product';
import {
  calculateActualPricesAndCheckActivity,
  toCreateGeneratedProductInputType,
} from '../product/calculate-product';
import { createGeneratedProductsInDb } from '../product/generated-product';
import { mergeAllProductLayers, MergedProduct } from '../product/merge-product';
import { UnitsResolverDeps } from './utils';

export const regenerateUnitData =
  (unitId: string) =>
  (deps: UnitsResolverDeps): Observable<boolean> => {
    // Clear previously generated products for the given UNIT
    return of(unitId).pipe(
      switchMap(deleteGeneratedProductsForAUnitFromDb(deps)),
      mapTo(unitId),
      switchMap(listUnitProductsForAUnit(deps)),
      switchMap(getMergedProductsFromUnitProducts(deps)),
      switchMap(mergedProducts =>
        combineLatest([
          getTimezoneForUnit(unitId)(deps),
          getProductComponentSetMap(mergedProducts[0].chainId)(deps), // all the unitProduct for the same unit has the same chainID
          getProductComponentMap(mergedProducts[0].chainId)(deps), // all the unitProduct for the same unit has the same chainID
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
      map(props =>
        props.products.map(product =>
          toCreateGeneratedProductInputType({
            product,
            unitId: props.mergedProducts[0].unitId,
            productComponentSetMap: props.productComponentSetMap,
            productComponentMap: props.productComponentMap,
            productConfigSets: product.configSets,
          }),
        ),
      ),
      // store generatedProducts in the db
      switchMap(createGeneratedProductsInDb),
      mapTo(true),
    );
  };

const calculateAndFilterNotActiveProducts = (
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
  }, <ProductWithPrices[]>[]);

const listUnitProductsForAUnit =
  (deps: UnitsResolverDeps) => (unitId: string) => {
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

const get3LayerFromAUnitProduct =
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
      switchMap(validateGroupProduct),
      switchMap(groupProduct =>
        from(deps.crudSdk.GetChainProduct({ id: groupProduct.parentId })).pipe(
          switchMap(validateChainProduct),
          map(chainProduct => ({ unitProduct, groupProduct, chainProduct })),
        ),
      ),
    );
  };

const getMergedProductsFromUnitProducts =
  (deps: UnitsResolverDeps) => (unitProducts: Array<CrudApi.UnitProduct>) =>
    from(unitProducts).pipe(
      mergeMap(unitProduct => get3LayerFromAUnitProduct(unitProduct)(deps), 2),
      map(productLayers => mergeAllProductLayers(productLayers)),
      toArray(),
    );

const getTimezoneForUnit =
  (unitId: string) =>
  (deps: UnitsResolverDeps): Observable<string> =>
    from(deps.crudSdk.GetUnit({ id: unitId })).pipe(
      map(unit => unit?.address?.location),
      filterNullish(),
      map(getTimezoneFromLocation),
    );

const getProductComponentSetMap =
  (chainId: string) =>
  (deps: UnitsResolverDeps): Observable<ProductComponentSetMap> => {
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
const getProductComponentMap =
  (chainId: string) =>
  (deps: UnitsResolverDeps): Observable<ProductComponentMap> => {
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
