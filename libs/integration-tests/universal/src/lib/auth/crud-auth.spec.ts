import { CrudApi, CrudApiQueryDocuments } from '@bgap/crud-gql/api';
import {
  crudBackendGraphQLClient,
  crudGraphqlClient,
  AuthenticatdGraphQLClientWithUserId,
  createAuthenticatedCrudGraphQLClient,
  executeQuery,
} from '@bgap/shared/graphql/api-client';

import {
  testAdminUsername,
  testAdminUserPassword,
  cartSeed,
} from '@bgap/shared/fixtures';

describe('CRUD endpoints AUTH test', () => {
  it('should require authentication to access', done => {
    return executeQuery(crudGraphqlClient)<CrudApi.GetCartQuery>(
      CrudApiQueryDocuments.getCart,
      { id: cartSeed.cart_seeded_01_id },
    ).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  describe('IAM Auth', () => {
    it('should be able to execute a query with IAM authenticated graphql client', done => {
      executeQuery(crudBackendGraphQLClient)<CrudApi.GetCartQuery>(
        CrudApiQueryDocuments.getCart,
        { id: cartSeed.cart_seeded_01_id },
      ).subscribe({
        next(x) {
          expect(x.getCart?.id).toEqual(cartSeed.cart_seeded_01_id);
          done();
        },
      });
    }, 15000);
  });

  describe('UserPool Auth', () => {
    let authHelper: AuthenticatdGraphQLClientWithUserId;

    beforeAll(async () => {
      authHelper = await createAuthenticatedCrudGraphQLClient(
        testAdminUsername,
        testAdminUserPassword,
      ).toPromise();
      console.warn(authHelper.userAttributes);
    });

    it('should be able to execute a query with userpool authenticated graphql client', done => {
      executeQuery(authHelper.graphQlClient)<CrudApi.GetCartQuery>(
        CrudApiQueryDocuments.getCart,
        { id: cartSeed.cart_seeded_01_id },
      ).subscribe({
        next(x) {
          expect(x.getCart?.id).toEqual(cartSeed.cart_seeded_01_id);
          done();
        },
      });
    }, 15000);
  });
});
