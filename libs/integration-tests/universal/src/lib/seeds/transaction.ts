import * as CrudApi from '@bgap/crud-gql/api';

import { resultTap } from './seed.util';

export const createTestTransaction = (
  input: CrudApi.CreateTransactionInput & { id: string },
  crudSdk: CrudApi.CrudSdk,
) =>
  crudSdk
    .CreateTransaction({ input })
    .pipe(resultTap('TRANSACTION create', input.id));

export const deleteTestTransaction = (id: string, crudSdk: CrudApi.CrudSdk) =>
  crudSdk
    .DeleteTransaction({ input: { id } })
    .pipe(resultTap('TRANSACTION delete', id));
