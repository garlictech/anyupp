import { AppsyncApi } from '@bgap/api/graphql/schema';
import { notExistingCartId } from './fixtures/cart';
import {
  appsyncGraphQlClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';
// import { createTestCart } from '@bgap/shared/utils';

export const cartWithNotExistingUNIT = 'cart_2_id';

describe('CreatCartFromOrder mutation test', () => {
  // beforeAll(async () => {
  //   await createTestCart({
  //     chainIdx: 1,
  //     groupIdx: 1,
  //     unitIdx: 999,
  //     productIdx: 1,
  //     userIdx: 1,
  //     cartIdx: 2,
  //   }).toPromise();
  // });

  it('should fail without a cart', done => {
    executeMutation(appsyncGraphQlClient)<
      AppsyncApi.CreateOrderFromCartMutation
    >(AppsyncApi.CreateOrderFromCart, {
      input: { id: notExistingCartId },
    }).subscribe({
      next(x) {
        expect(x.createOrderFromCart).toBeNull();
      },
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });
  }, 10000);

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
  }, 10000);
});
