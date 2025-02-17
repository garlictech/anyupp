import { CrudSdk } from '@bgap/crud-gql/api';
import { CreateUnitProductInput } from '@bgap/domain';
import { defer } from 'rxjs';

import { resultTap } from './seed.util';

export const createTestUnitProduct = (
  input: CreateUnitProductInput,
  crudSdk: CrudSdk,
) =>
  defer(() => crudSdk.CreateUnitProduct({ input })).pipe(
    resultTap('UNIT PRODUCT create', input.id!),
  );
