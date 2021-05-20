import {
  cartSeed,
  testAdminUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';
import { from } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {
  createAuthenticatedCrudSdk,
  createIamCrudSdk,
} from '../../api-clients';

describe('CRUD endpoints AUTH test', () => {
  const authSdk = createAuthenticatedCrudSdk(
    testAdminUsername,
    testAdminUserPassword,
  );

  const iamSdk = createIamCrudSdk();

  it('should require authentication to access', done => {
    authSdk
      .pipe(switchMap(sdk => sdk.GetCart({ id: cartSeed.cart_seeded_01_id })))
      .subscribe({
        error(e) {
          expect(e).toMatchSnapshot();
          done();
        },
      });
  }, 15000);

  describe('IAM Auth', () => {
    it('should be able to execute a query with IAM authenticated graphql client', done => {
      iamSdk.GetCart({ id: cartSeed.cart_seeded_01_id }).subscribe({
        next(x) {
          expect(x?.id).toEqual(cartSeed.cart_seeded_01_id);
          done();
        },
      });
    }, 15000);
  });
});
