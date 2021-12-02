import * as CrudApi from '@bgap/crud-gql/api';

import { resultTap } from './seed.util';

export const createTestOrder = (
  input: CrudApi.CreateOrderInput & { id: string },
  crudSdk: CrudApi.CrudSdk,
) => crudSdk.CreateOrder({ input }).pipe(resultTap('ORDER create', input.id));

export const deleteTestOrder = (id: string, crudSdk: CrudApi.CrudSdk) =>
  crudSdk.DeleteOrder({ input: { id } }).pipe(resultTap('ORDER delete', id));
