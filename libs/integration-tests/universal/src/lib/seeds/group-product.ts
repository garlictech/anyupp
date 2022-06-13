import { CrudSdk } from '@bgap/crud-gql/api';
import { CreateGroupProductInput } from '@bgap/domain';
import { resultTap } from './seed.util';

export const createTestGroupProduct = (
  input: CreateGroupProductInput,
  crudSdk: CrudSdk,
) =>
  crudSdk
    .CreateGroupProduct({ input })
    .pipe(resultTap('GROUP PRODUCT create', input.id!));

export const deleteTestGroupProduct = (id: string, crudSdk: CrudSdk) =>
  crudSdk
    .DeleteGroupProduct({ input: { id } })
    .pipe(resultTap('GROUP PRODUCT delete', id));
