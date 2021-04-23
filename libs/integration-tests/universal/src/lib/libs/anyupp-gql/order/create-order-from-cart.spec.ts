/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { combineLatest, from, Observable, throwError } from 'rxjs';
import { catchError, filter, map, switchMap } from 'rxjs/operators';

import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { orderRequestHandler } from '@bgap/anyupp-gql/backend';
import { CrudApi, CrudApiQueryDocuments } from '@bgap/crud-gql/api';
import {
  anyuppGraphQLClient,
  AuthenticatdGraphQLClientWithUserId,
  createAuthenticatedAnyuppGraphQLClient,
  crudBackendGraphQLClient,
  executeMutation,
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import { ICart, IOrder } from '@bgap/shared/types';

import { cartSeed } from '../../../fixtures/cart';
import { unitSeed } from '../../../fixtures/unit';
import { createTestCart, deleteTestCart } from '../../../seeds/cart';
import { testAdminUsername, testAdminUserPassword } from '../../../fixtures';

const cartWithNotExistingUNIT = 'cartWithNotExistingUnit_id';

describe('CreatCartFromOrder mutation test', () => {
  let authHelper: AuthenticatdGraphQLClientWithUserId;

  beforeAll(async () => {
    authHelper = await createAuthenticatedAnyuppGraphQLClient(
      testAdminUsername,
      testAdminUserPassword,
    ).toPromise();
    console.warn(authHelper.userAttributes);

    await combineLatest([
      // CleanUP
      deleteTestCart(cartSeed.cart_01.id),
      deleteTestCart(cartWithNotExistingUNIT),
    ])
      .pipe(
        switchMap(() =>
          // Seeding
          combineLatest([
            createTestCart(cartSeed.cart_01),
            createTestCart({
              ...cartSeed.cart_01,
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
      orderRequestHandler.createOrderFromCart(crudBackendGraphQLClient)({
        userId,
        input: { id: cartId },
      }),
    )
      .pipe(
        // check order has been truly created
        filter(x => !!x),
        switchMap(newOrderId =>
          combineLatest([
            getOrder(crudBackendGraphQLClient, newOrderId!),
            getCart(crudBackendGraphQLClient, cartId),
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
      orderRequestHandler.createOrderFromCart(crudBackendGraphQLClient)({
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
      orderRequestHandler.createOrderFromCart(crudBackendGraphQLClient)({
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
    executeMutation(authHelper.graphQlClient)<
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
  crudGraphqlClient: GraphqlApiClient,
  id: string,
): Observable<IOrder> => {
  return executeQuery(crudGraphqlClient)<CrudApi.GetOrderQuery>(
    CrudApiQueryDocuments.getOrder,
    { id },
  ).pipe(
    map(x => x.getOrder as IOrder),
    catchError(err => {
      console.error(err);
      return throwError('Internal Order query error');
    }),
  );
};

const getCart = (
  crudGraphqlClient: GraphqlApiClient,
  id: string,
): Observable<ICart> => {
  return executeQuery(crudGraphqlClient)<CrudApi.GetCartQuery>(
    CrudApiQueryDocuments.getCart,
    { id },
    { fetchPolicy: 'no-cache' },
  ).pipe(
    map(x => x.getCart as ICart),
    catchError(err => {
      console.error(err);
      return throwError('Internal Cart query error');
    }),
  );
};
