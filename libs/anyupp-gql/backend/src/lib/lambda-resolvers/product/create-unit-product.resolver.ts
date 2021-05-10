import { from, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { validateUnitProduct } from '@bgap/shared/data-validators';
import { ProductResolverDeps } from './utils';
import { IUnitProduct } from '@bgap/shared/types';

export const createUnitProduct = (input: AnyuppApi.CreateUnitProductInput) => (
  deps: ProductResolverDeps,
): Observable<IUnitProduct> =>
  from(deps.crudSdk.CreateUnitProduct({ input })).pipe(
    switchMap(validateUnitProduct),
  );
