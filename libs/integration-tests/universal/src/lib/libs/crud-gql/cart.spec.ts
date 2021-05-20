import {
  cartSeed,
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { concat } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { createAuthenticatedCrudSdk } from '../../../api-clients';
import { createTestCart, deleteTestCart } from '../../seeds/cart';

describe('getCart test', () => {
  const authSdk = createAuthenticatedCrudSdk(
    testAdminUsername,
    testAdminUserPassword,
  );

  const cleanup = authSdk.pipe(
    switchMap(sdk =>
      concat(
        deleteTestCart(cartSeed.cart_01.id, sdk),
        createTestCart(cartSeed.cart_01, sdk),
      ),
    ),
  );

  beforeAll(done => {
    cleanup.subscribe(() => done());
  }, 15000);

  afterAll(done => {
    cleanup.subscribe(() => done());
  });

  it('successful query execution', done => {
    authSdk
      .pipe(switchMap(sdk => sdk.GetCart({ id: cartSeed.cart_01.id })))
      .subscribe({
        next(x) {
          expect(x?.id).toEqual(cartSeed.cart_01.id);
          done();
        },
      });
  }, 15000);

  it('should return null for a not existing item', done => {
    authSdk
      .pipe(switchMap(sdk => sdk.GetCart({ id: cartSeed.cartId_NotExisting })))
      .subscribe({
        next(x) {
          expect(x).toBeNull();
          done();
        },
      });
  }, 10000);

  it('should throw error without id as input', done => {
    authSdk.pipe(switchMap(sdk => sdk.GetCart(undefined as any))).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);
});
