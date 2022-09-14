import { pipe } from 'fp-ts/lib/function';
import { of, throwError } from 'rxjs';
import { map, switchMap, mapTo } from 'rxjs/operators';
import * as R from 'ramda';

import { calculateOrderSumPriceRounded, CrudSdk } from '@bgap/crud-gql/api';
import { Cart } from '@bgap/domain';
import { getCartIsMissingError, throwIfEmptyValue } from '@bgap/shared/utils';

import { OrderResolverDeps } from './utils';

export const createOrderFromCart =
  (cartId: string) =>
  (deps: OrderResolverDeps): ReturnType<CrudSdk['CreateOrderFromCart']> => {
    console.debug(
      `Handling createOrderFromCart: cartId=${cartId}, userId=${deps.userId}`,
    );

    return deps.crudSdk
      .GetCart({ id: cartId }, { fetchPolicy: 'no-cache' })
      .pipe(
        throwIfEmptyValue<Cart>(`Cart is missing: ${cartId}`),
        switchMap(cart =>
          cart.userId === deps.userId
            ? of(cart)
            : throwError(getCartIsMissingError()),
        ),
        map(cart =>
          pipe(cart, R.omit(['createdAt', 'deletedAt', 'updatedAt']), cart => ({
            ...cart,
            sumPriceShown: calculateOrderSumPriceRounded(cart.items),
          })),
        ),
        switchMap(cart =>
          deps.crudSdk
            .CreateOrder({ input: R.omit(['id'], cart) })
            .pipe(
              switchMap(order =>
                deps.crudSdk
                  .DeleteCart({ input: { id: cart.id } })
                  .pipe(mapTo(order)),
              ),
            ),
        ),
        // Handle packaging fee - only in takeaway mode
        map(order => order?.id),
      );
  };
