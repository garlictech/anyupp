import * as CrudApi from '@bgap/crud-gql/api';
import { resultTap } from './seed.util';

export const createTestUnit = (
  input: CrudApi.CreateUnitInput,
  crudSdk: CrudApi.CrudSdk,
) => crudSdk.CreateUnit({ input }).pipe(resultTap('UNIT create', input.id!));

export const deleteTestUnit = (id: string, crudSdk: CrudApi.CrudSdk) =>
  crudSdk.DeleteUnit({ input: { id } }).pipe(resultTap('UNIT delete', id));
