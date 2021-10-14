import * as CrudApi from '@bgap/crud-gql/api';
import { defer, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { resultTap } from './seed.util';
import {
  productRequestHandler,
  ProductResolverDeps,
} from '@bgap/anyupp-gql/backend';

export const createTestUnitProduct = (
  input: CrudApi.CreateUnitProductInput,
  deps: ProductResolverDeps,
) =>
  defer(() => productRequestHandler(deps).createUnitProduct({ input })).pipe(
    resultTap('UNIT PRODUCT create', input.id!),
  );

export const deleteTestUnitProduct = (id: string, deps: ProductResolverDeps) =>
  defer(() =>
    productRequestHandler(deps).deleteUnitProduct({ input: { id } }),
  ).pipe(resultTap('UNIT PRODUCT delete', id));
