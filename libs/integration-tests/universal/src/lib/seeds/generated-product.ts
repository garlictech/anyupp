import { CrudSdk } from '@bgap/crud-gql/api';
import { CreateGeneratedProductInput } from '@bgap/domain';
import { resultTap } from './seed.util';

export const createTestGeneratedProduct = (
  input: CreateGeneratedProductInput,
  crudSdk: CrudSdk,
) =>
  crudSdk
    .CreateGeneratedProduct({ input })
    .pipe(resultTap('GENERATED PRODUCT create', input.id!));

export const deleteTestGeneratedProduct = (id: string, crudSdk: CrudSdk) =>
  crudSdk
    .DeleteGeneratedProduct({ input: { id } })
    .pipe(resultTap('GENERATED PRODUCT delete', id));
