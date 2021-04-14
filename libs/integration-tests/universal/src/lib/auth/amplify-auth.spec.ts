import { AmplifyApi, AmplifyApiQueryDocuments } from '@bgap/admin/amplify-api';
import {
  amplifyBackendGraphQlClient,
  amplifyGraphQlClient,
  AuthenticatdGraphQlClientWithUserId,
  createAuthenticatedAmplifyGraphQlClient,
  executeQuery,
} from '@bgap/shared/graphql/api-client';
import { testAdminUsername, testAdminUserPassword } from '../fixtures';

import { cartSeed } from '../fixtures/cart';

describe('Amplify endpoints AUTH test', () => {
  it('should require authentication to access', done => {
    return executeQuery(amplifyGraphQlClient)<AmplifyApi.GetCartQuery>(
      AmplifyApiQueryDocuments.getCart,
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
      executeQuery(amplifyBackendGraphQlClient)<AmplifyApi.GetCartQuery>(
        AmplifyApiQueryDocuments.getCart,
        { id: cartSeed.cart_seeded_01_id },
      ).subscribe({
        next(x) {
          expect(x.getCart?.id).toEqual(cartSeed.cart_01.id);
          done();
        },
      });
    }, 15000);
  });

  describe('UserPool Auth', () => {
    let authHelper: AuthenticatdGraphQlClientWithUserId;

    beforeAll(async () => {
      authHelper = await createAuthenticatedAmplifyGraphQlClient(
        testAdminUsername,
        testAdminUserPassword,
      ).toPromise();
      console.warn(authHelper.userAttributes);
    });

    it('should be able to execute a query with userpool authenticated graphql client', done => {
      executeQuery(authHelper.graphQlClient)<AmplifyApi.GetCartQuery>(
        AmplifyApiQueryDocuments.getCart,
        { id: cartSeed.cart_seeded_01_id },
      ).subscribe({
        next(x) {
          expect(x.getCart?.id).toEqual(cartSeed.cart_01.id);
          done();
        },
      });
    }, 15000);
  });
});
