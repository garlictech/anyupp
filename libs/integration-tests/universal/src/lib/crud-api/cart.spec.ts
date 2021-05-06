import * as CrudApi from '@bgap/crud-gql/api';
import { cartSeed } from '../fixtures/cart';
import {
  AuthenticatdGraphQLClientWithUserId,
  createAuthenticatedCrudGraphQLClient,
  executeQuery,
} from '@bgap/shared/graphql/api-client';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { createTestCart, deleteTestCart } from '../seeds/cart';
import { testAdminUsername, testAdminUserPassword } from '../fixtures/user';

describe('getCart test', () => {
  let authHelper: AuthenticatdGraphQLClientWithUserId;

  beforeAll(async () => {
    authHelper = await createAuthenticatedCrudGraphQLClient(
      testAdminUsername,
      testAdminUserPassword,
    ).toPromise();
    console.warn(authHelper.userAttributes);

    await combineLatest([
      // CleanUP
      deleteTestCart(),
    ])
      .pipe(
        switchMap(() =>
          // Seeding
          combineLatest([createTestCart()]),
        ),
      )
      .toPromise();
  }, 15000);

  it('successful query execution', done => {
    executeQuery(authHelper.graphQlClient)<CrudApi.GetCartQuery>(
      CrudApi.getCart,
      { id: cartSeed.cart_01.id },
    ).subscribe({
      next(x) {
        expect(x.getCart?.id).toEqual(cartSeed.cart_01.id);
        done();
      },
    });
  }, 15000);
  it('should return null for a not existing item', done => {
    executeQuery(authHelper.graphQlClient)<CrudApi.GetCartQuery>(
      CrudApi.getCart,
      { id: cartSeed.cartId_NotExisting },
    ).subscribe({
      next(x) {
        expect(x.getCart).toBeNull();
        done();
      },
    });
  }, 10000);
  it('should throw error without id as input', done => {
    executeQuery(authHelper.graphQlClient)<CrudApi.GetCartQuery>(
      CrudApi.getCart,
    ).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);
});
