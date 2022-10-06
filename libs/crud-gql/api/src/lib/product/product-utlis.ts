import { CrudSdk } from '../sdk';
import { CreateUnitProductInput } from '@bgap/domain';
import { RequiredId } from '@bgap/shared/types';
import { forkJoin, of } from 'rxjs';
import { switchMap, delay, catchError } from 'rxjs/operators';

export const deleteUnitProductWithVariants = (
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
