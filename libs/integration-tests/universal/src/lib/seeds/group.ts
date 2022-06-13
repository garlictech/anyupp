import { CrudSdk } from '@bgap/crud-gql/api';
import { CreateGroupInput } from '@bgap/domain';
import { resultTap } from './seed.util';

export const createTestGroup = (input: CreateGroupInput, crudSdk: CrudSdk) =>
  crudSdk.CreateGroup({ input }).pipe(resultTap('GROUP create', input.id!));

export const deleteTestGroup = (id: string, crudSdk: CrudSdk) =>
  crudSdk.DeleteGroup({ input: { id } }).pipe(resultTap('GROUP delete', id));
