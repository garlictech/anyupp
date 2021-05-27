import * as CrudApi from '@bgap/crud-gql/api';
import { resultTap } from './seed.util';

export const createTestGeneratedProduct = (
  input: CrudApi.CreateGeneratedProductInput,
  crudSdk: CrudApi.CrudSdk,
) =>
  crudSdk
    .CreateGeneratedProduct({ input })
    .pipe(resultTap('GENERATED PRODUCT create', input.id!));

export const deleteTestGeneratedProduct = (
  id: string,
  crudSdk: CrudApi.CrudSdk,
) =>
  crudSdk
    .DeleteGeneratedProduct({ input: { id } })
    .pipe(resultTap('GENERATED PRODUCT delete', id));
