import { combineLatest, defer, from } from 'rxjs';
import { switchMap, tap, throwIfEmpty, delay } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';
import { orderRequestHandler } from '@bgap/anyupp-gql/backend';
import {
  cartSeed,
  testAdminUsername,
  testAdminUserPassword,
  testIdPrefix,
  unitSeed,
} from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';

import { createTestCart, deleteTestCart } from '../../../seeds/cart';
import { createTestUnit, deleteTestUnit } from '../../../seeds/unit';
import {
  createAuthenticatedAnyuppSdk,
  createIamCrudSdk,
} from '../../../../api-clients';
import { filterNullish } from '@bgap/shared/utils';
import { AnyuppSdk } from 'libs/anyupp-gql/api/src';

const cart_01: RequiredId<CrudApi.CreateCartInput> = {
  ...cartSeed.cart_01,
  id: `${testIdPrefix}cart_1_id`,
  unitId: unitSeed.unit_01.id,
  userId: 'WILL BE THE AUTHENTICATED USERID',
};
const cart_02: RequiredId<CrudApi.CreateCartInput> = {
  ...cartSeed.cart_01,
  id: `${testIdPrefix}cart_2_id`,
  unitId: unitSeed.unit_01.id,
  userId: 'WILL BE THE AUTHENTICATED USERID',
};
const cart_03_different_user: RequiredId<CrudApi.CreateCartInput> = {
  ...cartSeed.cart_01,
  id: `${testIdPrefix}cart_3_id`,
  unitId: unitSeed.unit_01.id,
  userId: 'NOT_the_authenticated_USERID',
};
const cart_04_different_unit: RequiredId<CrudApi.CreateCartInput> = {
  ...cartSeed.cart_01,
  id: `${testIdPrefix}cart_4_id`,
  unitId: 'DIFFERENT_UNITID',
  userId: 'WILL BE THE AUTHENTICATED USERID',
};

describe('CreatCartFromOrder mutation test', () => {
  let authAnyuppSdk: AnyuppSdk;
  let authenticatedUserId: string;

  const orderDeps = {
    crudSdk: createIamCrudSdk(),
  };

  const cleanup = combineLatest([
    // CleanUP
    deleteTestCart(cart_01.id, orderDeps.crudSdk),
    deleteTestCart(cart_02.id, orderDeps.crudSdk),
    deleteTestCart(cart_03_different_user.id, orderDeps.crudSdk),
    deleteTestCart(cart_04_different_unit.id, orderDeps.crudSdk),
    deleteTestUnit(unitSeed.unit_01.id, orderDeps.crudSdk),
  ]);

  beforeAll(async done => {
    await createAuthenticatedAnyuppSdk(testAdminUsername, testAdminUserPassword)
      .toPromise()
      .then(x => {
        authAnyuppSdk = x.authAnyuppSdk;
        authenticatedUserId = x.userAttributes.id;
      });

    cart_01.userId = authenticatedUserId;
    cart_02.userId = authenticatedUserId;
    cart_04_different_unit.userId = authenticatedUserId;

    cleanup
      .pipe(
        switchMap(() =>
          // Seeding
          combineLatest([
            createTestUnit(unitSeed.unit_01, orderDeps.crudSdk),
            createTestCart(cart_01, orderDeps.crudSdk),
            createTestCart(cart_02, orderDeps.crudSdk),
            createTestCart(cart_03_different_user, orderDeps.crudSdk),
            createTestCart(cart_04_different_unit, orderDeps.crudSdk),
          ]),
        ),
      )
      .subscribe(() => done());
  });

  afterAll(async () => {
    await cleanup.toPromise();
  });

  it('should create an order from a valid cart', done => {
    const userId = cart_01.userId;
    const unitId = cart_01.unitId;
    const input = { id: cart_01.id };

    // To Debug use direct handler call
    // defer(() =>
    //   orderRequestHandler(orderDeps).createOrderFromCart({ userId, input }),
    // )
    authAnyuppSdk
      .CreateOrderFromCart({ input })
      .pipe(
        // check order has been truly created
        filterNullish<string>(),
        switchMap(newOrderId =>
          combineLatest([
            getOrder(orderDeps.crudSdk, newOrderId),
            getCart(orderDeps.crudSdk, cart_01.id),
          ]),
        ),
        tap({
          next([order, cart]) {
            expect(order).not.toBeNull();
            expect(order?.userId).toEqual(userId);
            expect(order?.unitId).toEqual(unitId);
            expect(order?.orderNum).toEqual(
              `${cart_01.place?.table}${cart_01.place?.seat}01`,
            );
            expect(cart).toBeNull();
          },
        }),
        // Secound ORDER with 02 as orderNum
        switchMap(() =>
          from(
            orderRequestHandler(orderDeps).createOrderFromCart({
              userId,
              input: { id: cart_02.id },
            }),
          ),
        ),
        switchMap(newOrderId =>
          combineLatest([
            getOrder(orderDeps.crudSdk, newOrderId),
            getCart(orderDeps.crudSdk, cart_01.id),
          ]),
        ),
        tap({
          next([order, cart]) {
            expect(order).not.toBeNull();
            expect(order?.orderNum).toEqual(
              `${cart_01.place?.table}${cart_01.place?.seat}02`,
            );
            expect(cart).toBeNull();
            done();
          },
        }),
        throwIfEmpty(),
      )
      .subscribe();
  }, 30000);

  it("should fail in case the cart is not the user's", done => {
    const cartId = cart_03_different_user.id;
    const userId = 'DIFFERENT_USER';
    const input = { id: cartId };

    // To Debug use direct handler call
    // defer(() =>
    //   orderRequestHandler(orderDeps).createOrderFromCart({
    //     userId,
    //     input,
    //   }),
    // )
    authAnyuppSdk
      .CreateOrderFromCart({
        input,
      })
      .subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
  }, 15000);

  it('should fail without a unit', done => {
    const cartId = cart_04_different_unit.id;
    const userId = cart_04_different_unit.userId;
    const input = { id: cartId };

    // defer(() =>
    //   orderRequestHandler(orderDeps).createOrderFromCart({
    //     userId,
    //     input,
    //   }),
    // )
    authAnyuppSdk
      .CreateOrderFromCart({
        input,
      })
      .subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
  }, 15000);

  it('should fail without a cart', done => {
    authAnyuppSdk
      .CreateOrderFromCart({
        input: { id: cartSeed.cartId_NotExisting },
      })
      .subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
  }, 15000);
});

// TODO: ?? relocate somewhere like a data-access lib
// because this is a duplication of the one tha is in the order.service.ts
const getOrder = (crudSdk: CrudApi.CrudSdk, id: string) => {
  return crudSdk.GetOrder({ id }, { fetchPolicy: 'no-cache' });
};

const getCart = (crudSdk: CrudApi.CrudSdk, id: string) => {
  return crudSdk.GetCart({ id }, { fetchPolicy: 'no-cache' });
};
