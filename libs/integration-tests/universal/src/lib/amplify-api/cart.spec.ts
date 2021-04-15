import { AmplifyApi, AmplifyApiQueryDocuments } from '@bgap/crud-gql/api';
import { cartSeed } from '../fixtures/cart';
import {
  amplifyGraphQlClient,
  executeQuery,
} from '@bgap/shared/graphql/api-client';
import { combineLatest } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { createTestCart, deleteTestCart } from '../seeds/cart';

describe('getCart test', () => {
  beforeAll(async () => {
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
    executeQuery(amplifyGraphQlClient)<AmplifyApi.GetCartQuery>(
      AmplifyApiQueryDocuments.getCart,
      { id: cartSeed.cart_01.id },
    ).subscribe({
      next(x) {
        expect(x.getCart?.id).toEqual(cartSeed.cart_01.id);
        done();
      },
    });
  }, 15000);
  it('should return null for a not existing item', done => {
    executeQuery(amplifyGraphQlClient)<AmplifyApi.GetCartQuery>(
      AmplifyApiQueryDocuments.getCart,
      { id: cartSeed.cartId_NotExisting },
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
  }, 15000);
});
