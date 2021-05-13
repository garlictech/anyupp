import { combineLatest, from } from 'rxjs';
import { filter, switchMap } from 'rxjs/operators';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { orderRequestHandler } from '@bgap/anyupp-gql/backend';
import { cartSeed } from '../../../fixtures/cart';
import { unitSeed } from '../../../fixtures/unit';
import { createTestCart, deleteTestCart } from '../../../seeds/cart';
import { testAdminUsername, testAdminUserPassword } from '../../../fixtures';
import {
  createAuthenticatedAnyuppSdk,
  createAuthenticatedCrudSdk,
} from '../../../../api-clients';

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
  const authCrudSdk = createAuthenticatedCrudSdk(
    testAdminUsername,
    testAdminUserPassword,
  );

  const authAnyuppSdk = createAuthenticatedAnyuppSdk(
    testAdminUsername,
    testAdminUserPassword,
  );

  const cleanup = () =>
    combineLatest([
      // CleanUP
      deleteTestCart(cart_01.id),
      deleteTestCart(cart_02.id),
      deleteTestCart(cartWithNotExistingUNIT),
    ]);

  beforeAll(async () => {
    await cleanup()
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

  afterAll(async () => {
    await cleanup().toPromise();
  });

  it('should create an order from a valid cart', done => {
    const userId = cart_01.userId;
    const unitId = cart_01.unitId;

    authCrudSdk
      .pipe(
        switchMap(crudSdk =>
          from(
            orderRequestHandler({ crudSdk }).createOrderFromCart({
              userId,
              input: { id: cartId },
            }),
          ).pipe(
            // check order has been truly created
            filter(x => !!x),
            switchMap(newOrderId =>
              combineLatest([
                from(crudSdk.GetOrder({ id: newOrderId })),
                from(crudSdk.GetCart({ id: cartId })),
              ]),
            ),
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

    authCrudSdk
      .pipe(
        switchMap(crudSdk =>
          from(
            orderRequestHandler({ crudSdk }).createOrderFromCart({
              userId,
              input: { id: cartId },
            }),
          ),
        ),
      )
      .subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
  }, 15000);

  it('should fail without a unit', done => {
    const cartId = cartWithNotExistingUNIT;
    const userId = cartSeed.cart_01.userId;

    authCrudSdk
      .pipe(
        switchMap(crudSdk =>
          from(
            orderRequestHandler({ crudSdk }).createOrderFromCart({
              userId,
              input: { id: cartId },
            }),
          ),
        ),
      )
      .subscribe({
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
          from(
            sdk.CreateOrderFromCart({
              input: { id: cartSeed.cartId_NotExisting },
            }),
          ),
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
