import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  createAuthenticatedCrudSdk,
  createIamCrudSdk,
} from '../../api-clients';
import { testAdminUsername, testAdminUserPassword } from '../fixtures';
import { cartSeed } from '../fixtures/cart';

describe('CRUD endpoints AUTH test', async () => {
  const authSdk = createAuthenticatedCrudSdk(
    testAdminUsername,
    testAdminUserPassword,
  );

  const iamSdk = createIamCrudSdk();

  it('should require authentication to access', done => {
    authSdk
      .pipe(
        switchMap(sdk => from(sdk.GetCart({ id: cartSeed.cart_seeded_01_id }))),
      )
      .subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
  }, 15000);

  describe('IAM Auth', () => {
    it('should be able to execute a query with IAM authenticated graphql client', done => {
      from(iamSdk.GetCart({ id: cartSeed.cart_seeded_01_id })).subscribe({
        next(x) {
          expect(x?.id).toEqual(cartSeed.cart_seeded_01_id);
          done();
        },
      });
    }, 15000);
  });
});
