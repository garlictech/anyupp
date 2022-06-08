import { CrudSdk } from '@bgap/crud-gql/api';
import { CreateOrderInput } from '@bgap/domain';
import { resultTap } from './seed.util';

export const createTestOrder = (
  input: CreateOrderInput & { id: string },
  crudSdk: CrudSdk,
) => crudSdk.CreateOrder({ input }).pipe(resultTap('ORDER create', input.id));

export const deleteTestOrder = (id: string, crudSdk: CrudSdk) =>
  crudSdk.DeleteOrder({ input: { id } }).pipe(resultTap('ORDER delete', id));
