import { AmplifyApi, AmplifyApiQueryDocuments } from '@bgap/admin/amplify-api';
import {
  amplifyGraphQlClient,
  executeQuery,
} from '@bgap/shared/graphql/api-client';

const existingCartId = 'cart_1_id';
const notExistingCartId = 'NOT_EXISTING_CART';

describe('getCart test', () => {
  it('successful query execution', done => {
    executeQuery(amplifyGraphQlClient)<AmplifyApi.GetCartQuery>(
      AmplifyApiQueryDocuments.getCart,
      { id: existingCartId },
    ).subscribe({
      next(x) {
        expect(x.getCart?.id).toEqual(existingCartId);
        done();
      },
    });
  });

  it('should return null for a not existing item', done => {
    executeQuery(amplifyGraphQlClient)<AmplifyApi.GetCartQuery>(
      AmplifyApiQueryDocuments.getCart,
      { id: notExistingCartId },
    ).subscribe({
      next(x) {
        expect(x.getCart).toBeNull();
        done();
      },
    });
  }, 10000);

  it('should throw error without id as input', done => {
    executeQuery(amplifyGraphQlClient)<AmplifyApi.GetCartQuery>(
      AmplifyApiQueryDocuments.getCart,
    ).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 10000);
});
