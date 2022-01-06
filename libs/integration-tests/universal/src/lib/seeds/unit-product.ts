import { defer } from 'rxjs';

import * as CrudApi from '@bgap/crud-gql/api';

import { resultTap } from './seed.util';

export const createTestUnitProduct = (
  input: CrudApi.CreateUnitProductInput,
  crudSdk: CrudApi.CrudSdk,
) =>
  defer(() => crudSdk.CreateUnitProduct({ input })).pipe(
    resultTap('UNIT PRODUCT create', input.id!),
  );

export const deleteTestUnitProduct = (
  id: string,

  crudSdk: CrudApi.CrudSdk,
) =>
  defer(() => crudSdk.DeleteUnitProduct({ input: { id } })).pipe(
    resultTap('UNIT PRODUCT delete', id),
  );
