import * as CrudApi from '@bgap/crud-gql/api';
import { defer, from, Observable, pipe } from 'rxjs';
import { delay, map, mapTo, switchMap } from 'rxjs/operators';
import { ProductResolverDeps } from './utils';
import { throwIfEmptyValue, createUpdateParams } from '@bgap/shared/utils';
import { pipe as fpPipe } from 'fp-ts/lib/function';

const ELASTICSEARCH_OPERATION_DELAY = 3000;

const callRegenerateOnUnitProductPipe = (deps: ProductResolverDeps) =>
  pipe(
    throwIfEmptyValue<CrudApi.UnitProduct>(),
    switchMap(unitProduct =>
      deps
        .regenerateUnitDataHandler(unitProduct.unitId)
        .pipe(mapTo(unitProduct)),
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
    ).pipe(
      map(res => res.Attributes as CrudApi.UnitProduct),
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnUnitProductPipe(deps),
    );

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
    ).pipe(
      map(res => res.Attributes as CrudApi.UnitProduct),
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnUnitProductPipe(deps),
    );

export const deleteUnitProduct =
  (deps: ProductResolverDeps) =>
  (id: CrudApi.Scalars['ID']): Observable<CrudApi.UnitProduct> =>
    defer(() =>
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
    ).pipe(
      map(res => res.Attributes as CrudApi.UnitProduct),
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnUnitProductPipe(deps),
    );
