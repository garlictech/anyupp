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
      deleteTestCart(),
      deleteTestCart(cartWithNotExistingUNIT),
    ]);

  beforeAll(async () => {
    await cleanup()
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

  afterAll(async () => {
    await cleanup().toPromise();
  });

  it('should create an order from a valid cart', done => {
    const cartId = cartSeed.cart_01.id;
    const userId = cartSeed.cart_01.userId;
    const unitId = cartSeed.cart_01.unitId;

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
      )
      .subscribe({
        next([order, cart]) {
          expect(order).not.toBeNull();
          expect(order?.userId).toEqual(userId);
          expect(order?.unitId).toEqual(unitId);
          expect(cart).toBeNull();
          done();
        },
      });
  }, 30000);

  it("should fail in case the cart is not the user's", done => {
    const cartId = cartSeed.cart_01.id;
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
