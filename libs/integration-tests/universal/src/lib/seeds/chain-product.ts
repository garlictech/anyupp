import * as CrudApi from '@bgap/crud-gql/api';
import { resultTap } from './seed.util';

export const createTestChainProduct = (
  input: CrudApi.CreateChainProductInput,
  crudSdk: CrudApi.CrudSdk,
) =>
  crudSdk
    .CreateChainProduct({ input })
    .pipe(resultTap('CHAIN PRODUCT create', input.id!));

export const deleteTestChainProduct = (id: string, crudSdk: CrudApi.CrudSdk) =>
  crudSdk
    .DeleteChainProduct({ input: { id } })
    .pipe(resultTap('CHAIN PRODUCT delete', id));
