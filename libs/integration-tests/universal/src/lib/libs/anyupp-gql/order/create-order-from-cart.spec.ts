import { combineLatest, from, of } from 'rxjs';
import { switchMap, tap, throwIfEmpty } from 'rxjs/operators';
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
const cart_03: RequiredId<CrudApi.CreateCartInput> = {
  ...cartSeed.cart_01,
  id: `${testIdPrefix}cart_3_id`,
  unitId: unitSeed.unit_01.id,
};

describe('CreatCartFromOrder mutation test', () => {
  const authAnyuppSdk = createAuthenticatedAnyuppSdk(
    testAdminUsername,
    testAdminUserPassword,
  );

  const orderDeps = {
    crudSdk: createIamCrudSdk(),
  };

  beforeAll(done => {
    authAnyuppSdk
      .pipe(
        switchMap(() =>
          combineLatest([
            // CleanUP
            deleteTestCart(cart_01.id, orderDeps.crudSdk),
            deleteTestCart(cart_02.id, orderDeps.crudSdk),
            deleteTestCart(cart_03.id, orderDeps.crudSdk),
            deleteTestCart(cartWithNotExistingUNIT, orderDeps.crudSdk),
            deleteTestUnit(unitSeed.unit_01.id, orderDeps.crudSdk),
          ]).pipe(
            switchMap(() =>
              // Seeding
              combineLatest([
                createTestUnit(unitSeed.unit_01, orderDeps.crudSdk),
                createTestCart(cart_01, orderDeps.crudSdk),
                createTestCart(cart_02, orderDeps.crudSdk),
                createTestCart(cart_03, orderDeps.crudSdk),
                createTestCart(
                  {
                    ...cartSeed.cart_01,
                    id: cartWithNotExistingUNIT,
                    unitId: unitSeed.unitId_NotExisting,
                  },
                  orderDeps.crudSdk,
                ),
              ]),
            ),
          ),
        ),
      )
      .subscribe(() => done());
  });

  it('should create an order from a valid cart', done => {
    const userId = cart_01.userId;
    const unitId = cart_01.unitId;

    of('START')
      .pipe(
        // First ORDER with 01 as orderNum
        switchMap(() =>
          from(
            orderRequestHandler(orderDeps).createOrderFromCart({
              userId,
              input: { id: cart_01.id },
            }),
          ),
        ),
        // check order has been truly created
        filterNullish(),
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
            expect(cart).not.toBeNull();
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
            expect(cart).not.toBeNull();
            done();
          },
        }),
        throwIfEmpty(),
      )
      .subscribe();
  }, 30000);

  it("should fail in case the cart is not the user's", done => {
    const cartId = cart_03.id;
    const userId = 'DIFFERENT_USER';
    from(
      orderRequestHandler(orderDeps).createOrderFromCart({
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
      orderRequestHandler(orderDeps).createOrderFromCart({
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
    authAnyuppSdk
      .pipe(
        switchMap(sdk =>
          sdk.CreateOrderFromCart({
            input: { id: cartSeed.cartId_NotExisting },
          }),
        ),
      )
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
  return crudSdk.GetOrder({ id });
};

const getCart = (crudSdk: CrudApi.CrudSdk, id: string) => {
  return crudSdk.GetCart({ id });
};
