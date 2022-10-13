import { CrudSdk } from '../sdk';
import { UnitProduct } from '@bgap/domain';
import { forkJoin, of } from 'rxjs';
import { switchMap, delay, catchError } from 'rxjs/operators';

export const deleteUnitProductWithVariants = (
  product: UnitProduct,
  crudSdk: CrudSdk,
) =>
  crudSdk.DeleteUnitProduct({ input: { id: product.id } }).pipe(
    switchMap(() =>
      forkJoin([
        ...(product.variants?.items?.map(variant => {
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
