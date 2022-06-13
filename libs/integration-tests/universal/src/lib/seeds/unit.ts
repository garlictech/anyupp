import { CrudSdk } from '@bgap/crud-gql/api';
import { CreateUnitInput } from '@bgap/domain';
import { resultTap } from './seed.util';

export const createTestUnit = (input: CreateUnitInput, crudSdk: CrudSdk) =>
  crudSdk.CreateUnit({ input }).pipe(resultTap('UNIT create', input.id!));

export const deleteTestUnit = (id: string, crudSdk: CrudSdk) =>
  crudSdk.DeleteUnit({ input: { id } }).pipe(resultTap('UNIT delete', id));
