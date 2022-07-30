import { CrudSdk } from '@bgap/crud-gql/api';
import { CreateUnitProductInput, UnitProduct } from '@bgap/domain';
import { RequiredId } from '@bgap/shared/types';
import { defer, forkJoin } from 'rxjs';

import { resultTap } from './seed.util';

export const createTestUnitProduct = (
  input: CreateUnitProductInput,
  crudSdk: CrudSdk,
) =>
  defer(() => crudSdk.CreateUnitProduct({ input })).pipe(
    resultTap('UNIT PRODUCT create', input.id!),
  );

export const deleteTestUnitProduct = (
  product: {
    id: RequiredId<CreateUnitProductInput>['id'];
    variants?: RequiredId<CreateUnitProductInput>['variants'];
  },
  crudSdk: CrudSdk,
) =>
  forkJoin([
    crudSdk.DeleteUnitProduct({ input: { id: product.id } }),
    ...(product.variants?.map(variant =>
      crudSdk.DeleteVariant({ input: { id: variant?.id || '' } }),
    ) || []),
  ]).pipe(resultTap('UNIT PRODUCT delete with its variants', product.id));
