import * as CrudApi from '@bgap/crud-gql/api';
import { defer, Observable, pipe } from 'rxjs';
import { delay, mapTo, switchMap } from 'rxjs/operators';
import { ProductResolverDeps } from './utils';
import { throwIfEmptyValue } from '@bgap/shared/utils';

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
    defer(() => deps.crudSdk.CreateUnitProduct({ input })).pipe(
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnUnitProductPipe(deps),
    );

export const updateUnitProduct =
  (deps: ProductResolverDeps) =>
  (input: CrudApi.UpdateUnitProductInput): Observable<CrudApi.UnitProduct> =>
    defer(() => deps.crudSdk.UpdateUnitProduct({ input })).pipe(
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnUnitProductPipe(deps),
    );

export const deleteUnitProduct =
  (deps: ProductResolverDeps) =>
  (id: CrudApi.Scalars['ID']): Observable<boolean> =>
    defer(() => deps.crudSdk.DeleteUnitProduct({ input: { id } })).pipe(
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnUnitProductPipe(deps),
      mapTo(true),
    );
