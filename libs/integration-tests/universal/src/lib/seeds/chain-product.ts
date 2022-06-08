import { CrudSdk } from '@bgap/crud-gql/api';
import { CreateChainProductInput } from '@bgap/domain';
import { resultTap } from './seed.util';

export const createTestChainProduct = (
  input: CreateChainProductInput,
  crudSdk: CrudSdk,
) =>
  crudSdk
    .CreateChainProduct({ input })
    .pipe(resultTap('CHAIN PRODUCT create', input.id!));

export const deleteTestChainProduct = (id: string, crudSdk: CrudSdk) =>
  crudSdk
    .DeleteChainProduct({ input: { id } })
    .pipe(resultTap('CHAIN PRODUCT delete', id));
