/* eslint-disable @typescript-eslint/no-non-null-assertion */

import { combineLatest, from, Observable, of, throwError } from 'rxjs';
import { catchError, filter, map, switchMap, tap } from 'rxjs/operators';

import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { orderRequestHandler } from '@bgap/anyupp-gql/backend';
import { CrudApi, CrudApiQueryDocuments } from '@bgap/crud-gql/api';
import {
  cartSeed,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
  unitSeed,
} from '@bgap/shared/fixtures';
import {
  AuthenticatdGraphQLClientWithUserId,
  createAuthenticatedAnyuppGraphQLClient,
  crudBackendGraphQLClient,
  executeMutation,
  executeQuery,
  GraphqlApiClient,
} from '@bgap/shared/graphql/api-client';
import { ICart, IOrder, RequiredId } from '@bgap/shared/types';

import { createTestCart, deleteTestCart } from '../../../seeds/cart';
import { createTestUnit, deleteTestUnit } from '../../../seeds/unit';

const cartWithNotExistingUNIT = 'cartWithNotExistingUnit_id';
const cart_01: RequiredId<CrudApi.CreateCartInput> = {
  ...cartSeed.cart_01,
  id: `${testIdPrefix}cart_1_id`,
  unitId: unitSeed.unit_01.id,
};
const cart_02: RequiredId<CrudApi.CreateCartInput> = {
  ...cartSeed.cart_01,
  id: `${testIdPrefix}cart_2_id`,
  unitId: unitSeed.unit_01.id,
};

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
      deleteTestCart(cart_01.id),
      deleteTestCart(cart_02.id),
      deleteTestCart(cartWithNotExistingUNIT),
      deleteTestUnit(unitSeed.unit_01.id),
    ])
      .pipe(
        switchMap(() =>
          // Seeding
          combineLatest([
            createTestUnit(unitSeed.unit_01),
            createTestCart(cart_01),
            createTestCart(cart_02),
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
    const userId = cart_01.userId;
    const unitId = cart_01.unitId;

    of('START')
      .pipe(
        // First ORDER with 01 as orderNum
        switchMap(() =>
          from(
            orderRequestHandler.createOrderFromCart(crudBackendGraphQLClient)({
              userId,
              input: { id: cart_01.id },
            }),
          ),
        ),
        // check order has been truly created
        filter(x => !!x),
        switchMap(newOrderId =>
          combineLatest([
            getOrder(crudBackendGraphQLClient, newOrderId!),
            getCart(crudBackendGraphQLClient, cart_01.id),
          ]),
        ),
        tap({
          next([{ createdAt, updatedAt, ...order }, cart]) {
            expect(order).not.toBeNull();
            expect(order.userId).toEqual(userId);
            expect(order.unitId).toEqual(unitId);
            expect(order.orderNum).toEqual(
              `${cart_01.place?.table}${cart_01.place?.seat}01`,
            );
            expect(cart).toBeNull();
          },
        }),
        // Secound ORDER with 02 as orderNum
        switchMap(() =>
          from(
            orderRequestHandler.createOrderFromCart(crudBackendGraphQLClient)({
              userId,
              input: { id: cart_02.id },
            }),
          ),
        ),
        switchMap(newOrderId =>
          combineLatest([
            getOrder(crudBackendGraphQLClient, newOrderId!),
            getCart(crudBackendGraphQLClient, cart_01.id),
          ]),
        ),
        tap({
          next([{ createdAt, updatedAt, ...order }, cart]) {
            expect(order).not.toBeNull();
            expect(order.orderNum).toEqual(
              `${cart_01.place?.table}${cart_01.place?.seat}02`,
            );
            expect(cart).toBeNull();
            done();
          },
        }),
      )
      .subscribe();
  }, 30000);

  it("should fail in case the cart is not the user's", done => {
    const cartId = cart_01.id;
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
    const userId = cart_01.userId;
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
    map(x => x.getOrder as unknown as IOrder), // TODO unknown!
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
    map(x => x.getCart as unknown as ICart), // TODO unknown!
    catchError(err => {
      console.error(err);
      return throwError('Internal Cart query error');
    }),
  );
};
