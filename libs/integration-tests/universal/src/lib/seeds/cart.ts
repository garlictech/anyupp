import * as CrudApi from '@bgap/crud-gql/api';
import { resultTap } from './seed.util';

export const createTestCart = (
  input: CrudApi.CreateCartInput & { id: string },
  crudSdk: CrudApi.CrudSdk,
) => crudSdk.CreateCart({ input }).pipe(resultTap('CART create', input.id));

export const deleteTestCart = (id: string, crudSdk: CrudApi.CrudSdk) =>
  crudSdk.DeleteCart({ input: { id } }).pipe(resultTap('CART delete', id));
