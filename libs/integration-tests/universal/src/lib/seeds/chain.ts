import { CrudSdk } from '@bgap/crud-gql/api';
import { CreateChainInput } from '@bgap/domain';
import { resultTap } from './seed.util';

export const createTestChain = (input: CreateChainInput, crudSdk: CrudSdk) =>
  crudSdk.CreateChain({ input }).pipe(resultTap('CHAIN create', input.id!));

export const deleteTestChain = (id: string, crudSdk: CrudSdk) =>
  crudSdk.DeleteChain({ input: { id } }).pipe(resultTap('CHAIN delete', id));
