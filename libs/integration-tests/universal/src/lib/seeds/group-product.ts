import * as CrudApi from '@bgap/crud-gql/api';
import { resultTap } from './seed.util';

export const createTestGroupProduct = (
  input: CrudApi.CreateGroupProductInput,
  crudSdk: CrudApi.CrudSdk,
) =>
  crudSdk
    .CreateGroupProduct({ input })
    .pipe(resultTap('GROUP PRODUCT create', input.id!));

export const deleteTestGroupProduct = (id: string, crudSdk: CrudApi.CrudSdk) =>
  crudSdk
    .DeleteGroupProduct({ input: { id } })
    .pipe(resultTap('GROUP PRODUCT delete', id));
