import * as CrudApi from '@bgap/crud-gql/api';
import { defer, from, Observable, pipe, UnaryFunction } from 'rxjs';
import {
  concatMap,
  defaultIfEmpty,
  delay,
  map,
  mapTo,
  switchMap,
  takeLast,
} from 'rxjs/operators';
import {
  getUnitIdsFromUnitProductList,
  listUnitProductsForGroupProductParents,
  ProductResolverDeps,
} from './utils';
import { throwIfEmptyValue, createUpdateParams } from '@bgap/shared/utils';
import { pipe as fpPipe } from 'fp-ts/lib/function';
import { regenerateUnitData } from '../unit';

const ELASTICSEARCH_OPERATION_DELAY = 3000;

const callRegenerateOnGroupProductPipe = (
  deps: ProductResolverDeps,
): UnaryFunction<
  Observable<CrudApi.GroupProduct>,
  Observable<CrudApi.GroupProduct>
> =>
  pipe(
    switchMap(groupProduct =>
      listUnitProductsForGroupProductParents(deps.crudSdk)([
        groupProduct.id,
      ]).pipe(
        map(getUnitIdsFromUnitProductList),
        switchMap(unitIds => from(unitIds)),
        concatMap(unitId => regenerateUnitData(deps.unitsDeps)(unitId)), // concatMap will wait all the regen calls to finish
        takeLast(1),
        mapTo(groupProduct),
        defaultIfEmpty(groupProduct),
      ),
    ),
  );

export const updateGroupProduct =
  (deps: ProductResolverDeps) =>
  (input: CrudApi.UpdateGroupProductInput): Observable<CrudApi.GroupProduct> =>
    defer(() =>
      fpPipe(
        createUpdateParams(deps.groupProductTableName, input.id, {
          ...input,
          updatedAt: new Date().toISOString(),
        }),
        params => from(deps.docClient.update(params).promise()),
      ),
    ).pipe(
      map(res => res.Attributes as CrudApi.GroupProduct),
      throwIfEmptyValue<CrudApi.GroupProduct>(),
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnGroupProductPipe(deps),
    );
