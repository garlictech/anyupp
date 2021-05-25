import * as CrudApi from '@bgap/crud-gql/api';
import { resultTap } from './seed.util';

export const createTestChain = (
  input: CrudApi.CreateChainInput,
  crudSdk: CrudApi.CrudSdk,
) => crudSdk.CreateChain({ input }).pipe(resultTap('CHAIN create', input.id!));

export const deleteTestChain = (id: string, crudSdk: CrudApi.CrudSdk) =>
  crudSdk.DeleteChain({ input: { id } }).pipe(resultTap('CHAIN delete', id));
