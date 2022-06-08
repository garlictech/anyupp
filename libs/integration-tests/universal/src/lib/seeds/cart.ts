import { CrudSdk } from '@bgap/crud-gql/api';
import { CreateCartInput } from '@bgap/domain';
import { resultTap } from './seed.util';

export const createTestCart = (
  input: CreateCartInput & { id: string },
  crudSdk: CrudSdk,
) => crudSdk.CreateCart({ input }).pipe(resultTap('CART create', input.id));

export const deleteTestCart = (id: string, crudSdk: CrudSdk) =>
  crudSdk.DeleteCart({ input: { id } }).pipe(resultTap('CART delete', id));
