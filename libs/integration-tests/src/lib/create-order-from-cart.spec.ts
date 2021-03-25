/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { AppsyncApi } from '@bgap/api/graphql/schema';
import {
  appsyncGraphQlClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';

import { cartSeed } from './fixtures/cart';
import { createTestCart, deleteTestCart } from './seeds/cart';
import { combineLatest } from 'rxjs';
import { unitSeed } from './fixtures/unit';
import { switchMap } from 'rxjs/operators';

const cartWithNotExistingUNIT = 'cartWithNotExistingUnit_id';

describe('CreatCartFromOrder mutation test', () => {
  beforeAll(async () => {
    await combineLatest([
      // CleanUP
      deleteTestCart(),
      deleteTestCart(cartWithNotExistingUNIT),
    ])
      .pipe(
        switchMap(() =>
          // Seeding
          combineLatest([
            createTestCart(),
            createTestCart({
              id: cartWithNotExistingUNIT,
              unitId: unitSeed.unitId_NotExisting,
            }).pipe(),
          ]),
        ),
      )
      .toPromise();
  });

  it('should fail without a cart', done => {
    executeMutation(appsyncGraphQlClient)<
      AppsyncApi.CreateOrderFromCartMutation
    >(AppsyncApi.CreateOrderFromCart, {
      input: { id: cartSeed.cartId_NotExisting },
    }).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  it('should fail without a unit', done => {
    executeMutation(appsyncGraphQlClient)<
      AppsyncApi.CreateOrderFromCartMutation
    >(AppsyncApi.CreateOrderFromCart, {
      input: { id: cartWithNotExistingUNIT },
    }).subscribe({
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 15000);

  // it('should create an order from a valid cart', done => {
  //   executeMutation(appsyncGraphQlClient)<
  //     AppsyncApi.CreateOrderFromCartMutation
  //   >(AppsyncApi.CreateOrderFromCart, {
  //     input: { id: cartSeed.cart_01.id },
  //   }).subscribe({
  //     next(x) {
  //       expect(x.createOrderFromCart).toBeNull();
  //       done();
  //     },
  //   });
  // }, 100000);
});
