import { defer, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { validateUnitProduct } from '@bgap/shared/data-validators';
import { ProductResolverDeps } from './utils';
import * as CrudApi from '@bgap/crud-gql/api';

export const createUnitProduct =
  (input: AnyuppApi.CreateUnitProductInput) =>
  (deps: ProductResolverDeps): Observable<CrudApi.UnitProduct> =>
    defer(() => deps.crudSdk.CreateUnitProduct({ input })).pipe(
      switchMap(validateUnitProduct),
    );
