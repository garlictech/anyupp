import { CrudSdk } from '@bgap/crud-gql/api';
import { CreateUnitProductInput } from '@bgap/domain';
import { RequiredId } from '@bgap/shared/types';
import { defer, forkJoin, of } from 'rxjs';
import { switchMap, tap, delay, catchError } from 'rxjs/operators';

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
  crudSdk.UpdateUnitProduct({ input: { id: product.id, variants: [] } }).pipe(
    switchMap(() => crudSdk.DeleteUnitProduct({ input: { id: product.id } })),
    switchMap(() =>
      forkJoin([
        ...(product.variants?.map(variant => {
          const obs = variant?.id
            ? crudSdk.DeleteVariant({ input: { id: variant.id } })
            : of({});
          return obs;
        }) || []),
      ]),
    ),
    delay(3000),
    catchError(err => {
      console.warn(
        'Potential error during product delete:',
        JSON.stringify(err, null, 2),
      );
      return of(err);
    }),
  );
