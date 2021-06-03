import * as CrudApi from '@bgap/crud-gql/api';
import { cartFixture } from '@bgap/shared/fixtures';
import { createIamCrudSdk } from '../../api-clients';

describe('CRUD endpoints AUTH test', () => {
  const crudSdk = CrudApi.getCrudSdkPublic();
  const iamSdk = createIamCrudSdk();

  it('should require authentication to access', done => {
    crudSdk.GetCart({ id: cartFixture.cart_seeded_01_id }).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  describe('IAM Auth', () => {
    it('should be able to execute a query with IAM authenticated graphql client', done => {
      iamSdk.GetCart({ id: cartFixture.cart_seeded_01_id }).subscribe({
        next(x) {
          expect(x?.id).toEqual(cartFixture.cart_seeded_01_id);
          done();
        },
      });
    }, 15000);
  });
});
