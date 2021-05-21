import { combineLatest, Observable, of, throwError } from 'rxjs';

import {
  catchError,
  defaultIfEmpty,
  filter,
  map,
  switchMap,
  mapTo,
} from 'rxjs/operators';
import {
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import { deleteGeneratedProductsForAUnit } from '../product';
import { CrudApi, CrudApiQueryDocuments } from '@bgap/crud-gql/api';
import * as fp from 'lodash/fp';
import {
  validateProductComponent,
  validateProductComponentSet,
  validateUnitProduct,
} from '@bgap/shared/data-validators';
import { createGeneratedProducts } from '../product/generated-product';
import { mergeAllProductLayers } from '../product/merge-product';
import {
  calculateActualPricesAndCheckActivity,
  toCreateGeneratedProductInputType,
} from '../product/calculate-product';
import { getTimezoneFromLocation } from '../../utils';
import {
  ProductComponentMap,
  ProductComponentSetMap,
  ProductWithPrices,
} from '@bgap/shared/types';

export const regenerateUnitData = ({
  unitId,
  crudGraphqlClient,
}: {
  unitId: string;
  crudGraphqlClient: GraphqlApiClient;
}): Observable<boolean> => {
  // TODO: refactor: use mergeMap or something to flatten the pipe
  // Clear previously generated products for the given UNIT
  return deleteGeneratedProductsForAUnit({ unitId, crudGraphqlClient }).pipe(
    switchMap(() =>
      // list all unitProducts+groupProducts+chainProducts for the given UNIT
      listProductsWith3LayerForAUnit({ unitId, crudGraphqlClient }),
    ),
    switchMap(unitProducts =>
      combineLatest([
        of(
          // merge product layers
          unitProducts.map(unitProduct =>
            mergeAllProductLayers({
              chainProduct: unitProduct.groupProduct.chainProduct,
              groupProduct: unitProduct.groupProduct,
              unitProduct,
            }),
          ),
        ),
        getTimezoneForUnit({ unitId, crudGraphqlClient }),
        getProductComponentSetMap({
          chainId: unitProducts[0].chainId, // all the unitProduct for the same unit has the same chainID
          crudGraphqlClient,
        }),
        getProductComponentMap({
          chainId: unitProducts[0].chainId, // all the unitProduct for the same unit has the same chainID
          crudGraphqlClient,
        }).pipe(defaultIfEmpty({})),
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
              productConfigSets: product.configSets,
              productComponentSetMap: props.productComponentSetMap,
              productComponentMap: props.productComponentMap,
            }),
          );
        }),
      ),
    ),
    // store generatedProducts in the db
    switchMap(createGeneratedProducts),
    catchError(err => {
      console.error(err);
      return throwError('Internal listUnitProducts query error');
    }),
    mapTo(true),
  );
};

const listProductsWith3LayerForAUnit = ({
  unitId,
  crudGraphqlClient,
}: {
  unitId: string;
  crudGraphqlClient: GraphqlApiClient;
}) => {
  const input: CrudApi.ListUnitProductsQueryVariables = {
    filter: { unitId: { eq: unitId } },
  };
  return executeQuery(crudGraphqlClient)<CrudApi.ListUnitProductsQuery>(
    CrudApiQueryDocuments.listUnitProducts,
    input,
    { fetchPolicy: 'no-cache' },
  ).pipe(
    map(x => x.listUnitProducts?.items),
    filter(fp.negate(fp.isEmpty)),
    defaultIfEmpty([]),
    switchMap(items => combineLatest(items.map(validateUnitProduct))),
    catchError(err => {
      console.error(err);
      return throwError('Internal listUnitProducts query error');
    }),
  );
};

const getTimezoneForUnit = ({
  unitId,
  crudGraphqlClient,
}: {
  unitId: string;
  crudGraphqlClient: GraphqlApiClient;
}): Observable<string> => {
  return executeQuery(crudGraphqlClient)<CrudApi.GetUnitQuery>(
    CrudApiQueryDocuments.getUnitAddress,
    { id: unitId },
  ).pipe(
    map(response => response.getUnit),
    filter(x => x !== null && x !== undefined),
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    map(unit => unit!.address.location),
    map(getTimezoneFromLocation),
  );
};

const getProductComponentSetMap = ({
  chainId,
  crudGraphqlClient,
}: {
  chainId: string;
  crudGraphqlClient: GraphqlApiClient;
}): Observable<ProductComponentSetMap> => {
  const input: CrudApi.ListProductComponentSetsQueryVariables = {
    filter: { chainId: { eq: chainId } },
  };
  return executeQuery(crudGraphqlClient)<CrudApi.ListProductComponentSetsQuery>(
    CrudApiQueryDocuments.listProductComponentSets,
    input,
    { fetchPolicy: 'no-cache' },
  ).pipe(
    // TODO: choose one:
    map(response => response.listProductComponentSets?.items),
    filter(fp.negate(fp.isEmpty)),
    defaultIfEmpty([]),
    switchMap(items => combineLatest(items.map(validateProductComponentSet))),
    // IN CASE YOU ARE A CHEATER :)
    // map(
    //   response =>
    //     response.listProductComponentSets?.items as Required<
    //       CrudApi.ProductComponentSet
    //     >[],
    // ),
    //
    // ALMOST WORKS:
    // [### getProductComponentSetMap 4: Error] "listProductComponentSet Object Validation Error: \"nextToken\" must be a string, \"__typename\" is not allowed"
    // switchMap(
    //   validateGqlList<Required<CrudApi.ProductComponentSet>[]>(
    //     productComponentSetSchema,
    //     'ProductComponentSet',
    //   ).validate,
    // ),
    map(prodCompSets =>
      prodCompSets.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {}),
    ),
    catchError(err => {
      console.error(err);
      return throwError('Internal lisProductComponentSets query error');
    }),
  );
};
const getProductComponentMap = ({
  chainId,
  crudGraphqlClient,
}: {
  chainId: string;
  crudGraphqlClient: GraphqlApiClient;
}): Observable<ProductComponentMap> => {
  const input: CrudApi.ListProductComponentsQueryVariables = {
    filter: { chainId: { eq: chainId } },
  };
  return executeQuery(crudGraphqlClient)<CrudApi.ListProductComponentsQuery>(
    CrudApiQueryDocuments.listProductComponents,
    input,
    { fetchPolicy: 'no-cache' },
  ).pipe(
    map(response => response.listProductComponents?.items),
    filter(fp.negate(fp.isEmpty)),
    defaultIfEmpty([]),
    switchMap(items => combineLatest(items.map(validateProductComponent))),
    catchError(err => {
      console.error(err);
      return throwError('Internal lisProductComponents query error');
    }),
    map(prodComps =>
      prodComps.reduce((prev, curr) => ({ ...prev, [curr.id]: curr }), {}),
    ),
  );
};

// export const validateGqlList = <T>(
//   itemSchema: Joi.SchemaMap,
//   label: string,
// ) => {
//   const listSchema = {
//     items: Joi.array().items(itemSchema),
//     nextToken: Joi.string().optional(),
//   };
//   return validateSchema<T>(listSchema, `list${label}`);
// };
