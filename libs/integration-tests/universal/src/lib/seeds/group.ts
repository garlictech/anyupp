import * as CrudApi from '@bgap/crud-gql/api';
import { resultTap } from './seed.util';

export const createTestGroup = (
  input: CrudApi.CreateGroupInput,
  crudSdk: CrudApi.CrudSdk,
) => crudSdk.CreateGroup({ input }).pipe(resultTap('GROUP create', input.id!));

export const deleteTestGroup = (id: string, crudSdk: CrudApi.CrudSdk) =>
  crudSdk.DeleteGroup({ input: { id } }).pipe(resultTap('GROUP delete', id));
