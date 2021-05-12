import { cartSeed } from '../fixtures/cart';
import { combineLatest, concat, from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { createTestCart, deleteTestCart } from '../seeds/cart';
import { testAdminUsername, testAdminUserPassword } from '../fixtures/user';
import { createAuthenticatedCrudSdk } from '../../api-clients';

describe('getCart test', () => {
  const authSdk = createAuthenticatedCrudSdk(
    testAdminUsername,
    testAdminUserPassword,
  );

  beforeAll(async () => {
    await authSdk
      .pipe(
        switchMap(sdk => concat(deleteTestCart()(sdk), createTestCart()(sdk))),
      )
      .toPromise();
  }, 15000);

  afterAll(async () => {
    await authSdk.pipe(switchMap(sdk => deleteTestCart()(sdk))).toPromise();
  });

  it('successful query execution', done => {
    authSdk
      .pipe(switchMap(sdk => from(sdk.GetCart({ id: cartSeed.cart_01.id }))))
      .subscribe({
        next(x) {
          expect(x?.id).toEqual(cartSeed.cart_01.id);
          done();
        },
      });
  }, 15000);

  it('should return null for a not existing item', done => {
    authSdk
      .pipe(
        switchMap(sdk =>
          from(sdk.GetCart({ id: cartSeed.cartId_NotExisting })),
        ),
      )
      .subscribe({
        next(x) {
          expect(x).toBeNull();
          done();
        },
      });
  }, 10000);

  it('should throw error without id as input', done => {
    authSdk
      .pipe(switchMap(sdk => from(sdk.GetCart(undefined as any))))
      .subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
  }, 15000);
});
