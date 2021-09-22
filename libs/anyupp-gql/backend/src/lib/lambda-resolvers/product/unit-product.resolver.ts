import * as AnyuppApi from '@bgap/anyupp-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import { validateUnitProduct } from '@bgap/shared/data-validators';
import { defer, Observable, pipe } from 'rxjs';
import { delay, mapTo, switchMap } from 'rxjs/operators';
import { ProductResolverDeps } from './utils';

const ELASTICSEARCH_OPERATION_DELAY = 3000;

const callRegenerateOnUnitProductPipe = (deps: ProductResolverDeps) =>
  pipe(
    switchMap(validateUnitProduct),
    switchMap(unitProduct =>
      deps
        .regenerateUnitDataHandler(unitProduct.unitId)
        .pipe(mapTo(unitProduct)),
    ),
  );

export const createUnitProduct =
  (deps: ProductResolverDeps) =>
  (input: AnyuppApi.CreateUnitProductInput): Observable<CrudApi.UnitProduct> =>
    defer(() => deps.crudSdk.CreateUnitProduct({ input })).pipe(
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnUnitProductPipe(deps),
    );

export const updateUnitProduct =
  (deps: ProductResolverDeps) =>
  (input: AnyuppApi.UpdateUnitProductInput): Observable<CrudApi.UnitProduct> =>
    defer(() => deps.crudSdk.UpdateUnitProduct({ input })).pipe(
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnUnitProductPipe(deps),
    );

export const deleteUnitProduct =
  (deps: ProductResolverDeps) =>
  (id: AnyuppApi.Scalars['ID']): Observable<boolean> =>
    defer(() => deps.crudSdk.DeleteUnitProduct({ input: { id } })).pipe(
      delay(ELASTICSEARCH_OPERATION_DELAY),
      callRegenerateOnUnitProductPipe(deps),
      mapTo(true),
    );
