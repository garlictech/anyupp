import * as fp from 'lodash/fp';
import { iif, Observable, of, throwError } from 'rxjs';
import {
  catchError,
  defaultIfEmpty,
  filter,
  map,
  switchMap,
  tap,
} from 'rxjs/operators';

import { CrudApi, CrudApiQueryDocuments } from '@bgap/crud-gql/api';
import {
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import { IGeneratedProduct } from '@bgap/shared/types';
import { tableConfig } from '@bgap/crud-gql/backend';

import {
  executeBatchDelete,
  executeBatchPut,
} from '../../utils/dynamodb.utils';

const TABLE_NAME = tableConfig.GeneratedProduct;

export const deleteGeneratedProductsForAUnit = ({
  unitId,
  crudGraphqlClient,
}: {
  unitId: string;
  crudGraphqlClient: GraphqlApiClient;
}) => {
  return listGeneratedProductsForUnits({
    crudGraphqlClient,
    unitIds: [unitId],
    noCache: true,
  }).pipe(
    switchMap(items => iif(() => items.length > 0, deleteItems(items), of([]))),
  );
};

const deleteItems = (items: IGeneratedProduct[]) =>
  of(items).pipe(
    map(generatedProducts => generatedProducts.map(x => x.id)),
    switchMap(executeBatchDelete(TABLE_NAME)),
    tap({
      next() {
        console.log(
          `deleteGeneratedProductsForAUnit EXECUTED ${items.length} item deleted`,
        );
      },
    }),
  );

export const createGeneratedProducts = (
  products: CrudApi.CreateGeneratedProductInput[],
) => {
  return executeBatchPut(TABLE_NAME)(products);
};

export const listGeneratedProductsForUnits = ({
  crudGraphqlClient,
  unitIds,
  noCache = false,
}: {
  crudGraphqlClient: GraphqlApiClient;
  unitIds: Array<string>;
  noCache?: boolean;
}): Observable<Array<IGeneratedProduct>> => {
  const input: CrudApi.ListGeneratedProductsQueryVariables = {
    filter: { or: unitIds.map(x => ({ unitId: { eq: x } })) },
  };
  return executeQuery(crudGraphqlClient)<CrudApi.ListGeneratedProductsQuery>(
    CrudApiQueryDocuments.listGeneratedProducts,
    input,
    noCache ? { fetchPolicy: 'no-cache' } : {},
  ).pipe(
    map(x => x.listGeneratedProducts?.items),
    filter(fp.negate(fp.isEmpty)),
    defaultIfEmpty([]),
    // TODO: switchMap((items: []) => combineLatest(items.map(validateUnit))),
    catchError(err => {
      console.error(err);
      return throwError('Internal listGeneratedProducts query error');
    }),
  );
};
