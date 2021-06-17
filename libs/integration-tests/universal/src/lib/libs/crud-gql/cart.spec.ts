import * as CrudApi from '@bgap/crud-gql/api';
import {
  cartFixture,
  testAdminEmail,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { switchMap } from 'rxjs/operators';
import { createAuthenticatedCrudSdk } from '../../../api-clients';
import { createTestCart, deleteTestCart } from '../../seeds/cart';

describe('getCart test', () => {
  let authSdk: CrudApi.CrudSdk;

  beforeAll(async () => {
    authSdk = await createAuthenticatedCrudSdk(
      testAdminEmail,
      testAdminUserPassword,
    ).toPromise();

    await deleteTestCart(cartFixture.cart_01.id, authSdk)
      .pipe(switchMap(() => createTestCart(cartFixture.cart_01, authSdk)))
      .toPromise();
  }, 15000);

  afterAll(async () => {
    await deleteTestCart(cartFixture.cart_01.id, authSdk).toPromise();
  });

  it('successful query execution', done => {
    authSdk.GetCart({ id: cartFixture.cart_01.id }).subscribe({
      next(x) {
        expect(x?.id).toEqual(cartFixture.cart_01.id);
        done();
      },
    });
  }, 15000);

  it('should return null for a not existing item', done => {
    authSdk.GetCart({ id: cartFixture.cartId_NotExisting }).subscribe({
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
