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
import { validateUnitProduct } from '@bgap/shared/data-validators';
import { createGeneratedProducts } from '../product/generated-product';
import { mergeAllProductLayers } from '../product/merge-product';
import { calculateActualPricesAndCheckActivity } from '../product/calculate-product';
import { getTimezoneFromLocation } from '../../utils';
import { IGeneratedProduct } from '@bgap/shared/types';

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
      ]),
    ),
    // calculate actual Prize for all the mergedProducts
    map(([mergedProducts, unitTimeZone]) =>
      mergedProducts.map(
        mergedProduct =>
          calculateActualPricesAndCheckActivity({
            product: mergedProduct,
            atTimeISO: new Date().toISOString(),
            inTimeZone: unitTimeZone,
          }) || null,
      ),
    ),
    map(
      productsToGenerate =>
        productsToGenerate.filter(x => !!x) as IGeneratedProduct[],
    ),
    // store generatedProducts in the db
    switchMap(createGeneratedProducts),
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
