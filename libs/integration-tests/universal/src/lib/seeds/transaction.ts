import { CrudSdk } from '@bgap/crud-gql/api';
import { CreateTransactionInput } from '@bgap/domain';
import { resultTap } from './seed.util';

export const createTestTransaction = (
  input: CreateTransactionInput & { id: string },
  crudSdk: CrudSdk,
) =>
  crudSdk
    .CreateTransaction({ input })
    .pipe(resultTap('TRANSACTION create', input.id));

export const deleteTestTransaction = (id: string, crudSdk: CrudSdk) =>
  crudSdk
    .DeleteTransaction({ input: { id } })
    .pipe(resultTap('TRANSACTION delete', id));
