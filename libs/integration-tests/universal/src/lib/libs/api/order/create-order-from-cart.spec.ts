/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { combineLatest, Observable, from } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { CrudApi, CrudApiQueryDocuments } from '@bgap/crud-gql/api';
import { orderRequestHandler } from '@bgap/anyupp-gql/backend';
import {
  amplifyGraphQlClient,
  appsyncGraphQlClient,
  executeMutation,
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import { ICart, IOrder } from '@bgap/shared/types';

import { cartSeed } from '../../../fixtures/cart';
import { unitSeed } from '../../../fixtures/unit';
import { createTestCart, deleteTestCart } from '../../../seeds/cart';

const cartWithNotExistingUNIT = 'cartWithNotExistingUnit_id';

describe('CreatCartFromOrder mutation test', () => {
  beforeAll(async () => {
    await combineLatest([
      // CleanUP
      deleteTestCart(),
      deleteTestCart(cartWithNotExistingUNIT),
    ])
      .pipe(
        switchMap(() =>
          // Seeding
          combineLatest([
            createTestCart(),
            createTestCart({
              id: cartWithNotExistingUNIT,
              unitId: unitSeed.unitId_NotExisting,
            }),
          ]),
        ),
      )
      .toPromise();
  });

  it('should create an order from a valid cart', done => {
    const cartId = cartSeed.cart_01.id;
    const userId = cartSeed.cart_01.userId;
    const unitId = cartSeed.cart_01.unitId;

    from(
      orderRequestHandler.createOrderFromCart(amplifyGraphQlClient)({
        userId,
        input: { id: cartId },
      }),
    )
      .pipe(
        // check order has been truly created
        filter(x => !!x),
        switchMap(newOrderId =>
          combineLatest([
            getOrder(amplifyGraphQlClient, newOrderId!),
            getCart(amplifyGraphQlClient, cartId),
          ]),
        ),
      )
      .subscribe({
        next([order, cart]) {
          expect(order).not.toBeNull();
          expect(order.userId).toEqual(userId);
          expect(order.unitId).toEqual(unitId);
          expect(cart).toBeNull();
          done();
        },
      });
  }, 30000);

  it("should fail in case the cart is not the user's", done => {
    const cartId = cartSeed.cart_01.id;
    const userId = 'DIFFERENT_USER';
    from(
      orderRequestHandler.createOrderFromCart(amplifyGraphQlClient)({
        userId,
        input: { id: cartId },
      }),
    ).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  it('should fail without a unit', done => {
    const cartId = cartWithNotExistingUNIT;
    const userId = cartSeed.cart_01.userId;
    from(
      orderRequestHandler.createOrderFromCart(amplifyGraphQlClient)({
        userId,
        input: { id: cartId },
      }),
    ).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  it('should fail without a cart', done => {
    executeMutation(appsyncGraphQlClient)<
      AnyuppApi.CreateOrderFromCartMutation
    >(AnyuppApi.CreateOrderFromCart, {
      input: { id: cartSeed.cartId_NotExisting },
    }).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);
});

// TODO: ?? relocate somewhere like a data-access lib
// because this is a duplication of the one tha is in the order.service.ts
const getOrder = (
  amplifyApiClient: GraphqlApiClient,
  id: string,
): Observable<IOrder> => {
  return executeQuery(amplifyApiClient)<CrudApi.GetOrderQuery>(
    CrudApiQueryDocuments.getOrder,
    { id },
  ).pipe(map(x => x.getOrder as IOrder));
};

const getCart = (
  amplifyApiClient: GraphqlApiClient,
  id: string,
): Observable<ICart> => {
  return executeQuery(amplifyApiClient)<CrudApi.GetCartQuery>(
    CrudApiQueryDocuments.getCart,
    { id },
    { fetchPolicy: 'no-cache' },
  ).pipe(map(x => x.getCart as ICart));
};
