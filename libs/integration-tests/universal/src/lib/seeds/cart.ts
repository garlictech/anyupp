import { cartSeed } from '../fixtures/cart';
import { tap, catchError } from 'rxjs/operators';
import { from, throwError } from 'rxjs';
import { CrudSdk, CreateCartInput } from '@bgap/crud-gql/api';

export const createTestCart = (overwrites: Partial<CreateCartInput> = {}) => (
  crudSdk: CrudSdk,
) =>
  from(
    crudSdk.CreateCart({
      input: {
        ...cartSeed.cart_01,
        ...overwrites,
      },
    }),
  ).pipe(
    tap({
      next(cart) {
        console.log('### new CART created with id: ' + cart?.id);
      },
      error(err) {
        console.error('Error during test cart creation: ', err.message);
      },
    }),
  );

export const deleteTestCart = (id: string = cartSeed.cart_01.id!) => (
  crudSdk: CrudSdk,
) =>
  from(
    crudSdk.DeleteCart({
      input: { id },
    }),
  ).pipe(
    tap({
      next(cart) {
        console.log('### CART deleted with id: ' + cart?.id);
      },
    }),
    catchError(err => {
      console.error('Error during cart delete with id:' + id, err.message);
      return throwError(
        `Error during cart delete with id: ${id}, Err: ${err.message}`,
      );
    }),
  );
