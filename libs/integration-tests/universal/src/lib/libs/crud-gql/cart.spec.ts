import {
  cartFixture,
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { CrudSdk } from '@bgap/crud-gql/api';
import { switchMap } from 'rxjs/operators';
import { createAuthenticatedCrudSdk } from '../../../api-clients';
import { createTestCart, deleteTestCart } from '../../seeds/cart';

describe('getCart test', () => {
  let authSdk: CrudSdk;

  beforeAll(async () => {
    authSdk = await createAuthenticatedCrudSdk(
      testAdminUsername,
      testAdminUserPassword,
    ).toPromise();
  }, 60000);

  beforeEach(async () => {
    await deleteTestCart(cartFixture.cart_01.id, authSdk)
      .pipe(switchMap(() => createTestCart(cartFixture.cart_01, authSdk)))
      .toPromise();
  }, 60000);

  afterAll(async () => {
    await deleteTestCart(cartFixture.cart_01.id, authSdk).toPromise();
  }, 60000);

  it('successful query execution', done => {
    authSdk.GetCart({ id: cartFixture.cart_01.id }).subscribe({
      next(x) {
        expect(x?.id).toEqual(cartFixture.cart_01.id);
        done();
      },
    });
  }, 60000);

  it('should return null for a not existing item', done => {
    authSdk.GetCart({ id: cartFixture.cartId_NotExisting }).subscribe({
      next(x) {
        expect(x).toBeNull();
        done();
      },
    });
  }, 60000);

  it('should throw error without id as input', done => {
    authSdk.GetCart(undefined as any).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 60000);
});
