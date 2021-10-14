import * as CrudApi from '@bgap/crud-gql/api';
import { defer, from, iif, Observable, of } from 'rxjs';
import { delay, map, mapTo, switchMap, tap } from 'rxjs/operators';
import { ProductResolverDeps } from './utils';
import { createUpdateParams } from '@bgap/shared/utils';
import { pipe as fpPipe } from 'fp-ts/lib/function';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { regenerateUnitData } from '../unit';

const ELASTICSEARCH_OPERATION_DELAY = 3000;

const postprocessUnit =
  (deps: ProductResolverDeps) =>
  (dynamoDbResult?: { Attributes?: DocumentClient.AttributeMap }) =>
    fpPipe(
      of(dynamoDbResult),
      map(res => res?.Attributes as CrudApi.UnitProduct),
      switchMap(res =>
        iif(
          () => !!res,
          of(res).pipe(
            delay(ELASTICSEARCH_OPERATION_DELAY),
            switchMap(() => regenerateUnitData(deps.unitsDeps)(res.unitId)),
            mapTo(res),
          ),
          of(res),
        ),
      ),
    );

export const createUnitProduct =
  (deps: ProductResolverDeps) =>
  (input: CrudApi.CreateUnitProductInput): Observable<CrudApi.UnitProduct> =>
    defer(() =>
      from(
        deps.docClient
          .put({
            TableName: deps.unitProductTableName,
            Item: {
              ...input,
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            },
          })
          .promise(),
      ),
    ).pipe(switchMap(postprocessUnit(deps)));

export const updateUnitProduct =
  (deps: ProductResolverDeps) =>
  (input: CrudApi.UpdateUnitProductInput): Observable<CrudApi.UnitProduct> =>
    defer(() =>
      fpPipe(
        createUpdateParams(deps.unitProductTableName, input.id, {
          ...input,
          updatedAt: new Date().toISOString(),
        }),
        params => from(deps.docClient.update(params).promise()),
      ),
    ).pipe(switchMap(postprocessUnit(deps)));

export const deleteUnitProduct =
  (deps: ProductResolverDeps) =>
  (id: CrudApi.Scalars['ID']): Observable<CrudApi.UnitProduct> => {
    return defer(() =>
      from(
        deps.docClient
          .delete({
            TableName: deps.unitProductTableName,
            Key: {
              id,
            },
          })
          .promise(),
      ),
    ).pipe(switchMap(postprocessUnit(deps)));
  };
