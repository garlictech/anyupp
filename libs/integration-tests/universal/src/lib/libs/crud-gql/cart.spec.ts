import {
  cartSeed,
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { switchMap, tap } from 'rxjs/operators';
import { createAuthenticatedCrudSdk } from '../../../api-clients';
import { createTestCart, deleteTestCart } from '../../seeds/cart';
import * as CrudApi from '@bgap/crud-gql/api';

describe('getCart test', () => {
  let authSdk: CrudApi.CrudSdk;

  beforeAll(async () => {
    authSdk = await createAuthenticatedCrudSdk(
      testAdminUsername,
      testAdminUserPassword,
    ).toPromise();

    await deleteTestCart(cartSeed.cart_01.id, authSdk)
      .pipe(switchMap(() => createTestCart(cartSeed.cart_01, authSdk)))
      .toPromise();
  }, 15000);

  afterAll(async () => {
    await deleteTestCart(cartSeed.cart_01.id, authSdk).toPromise();
  });

  it('successful query execution', done => {
    authSdk.GetCart({ id: cartSeed.cart_01.id }).subscribe({
      next(x) {
        expect(x?.id).toEqual(cartSeed.cart_01.id);
        done();
      },
    });
  }, 15000);

  it('should return null for a not existing item', done => {
    authSdk.GetCart({ id: cartSeed.cartId_NotExisting }).subscribe({
      next(x) {
        expect(x).toBeNull();
        done();
      },
    });
  }, 10000);

  it('should throw error without id as input', done => {
    authSdk.GetCart(undefined as any).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);
});
