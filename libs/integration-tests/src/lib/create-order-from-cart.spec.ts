import { AppsyncApi } from '@bgap/api/graphql/schema';
import {
  appsyncGraphQlClient,
  executeMutation,
} from '@bgap/shared/graphql/api-client';

describe('CreatCartFromOrder mutation test', () => {
  it('should fail without a cart', done => {
    executeMutation(appsyncGraphQlClient)<
      AppsyncApi.CreateOrderFromCartMutation
    >(AppsyncApi.CreateOrderFromCart, {
      input: { id: 'cart_1_id' },
    }).subscribe({
      next(x) {
        expect(x.createOrderFromCart).toBeNull();
      },
      error(e) {
        expect(e).toMatchSnapshot();
        done();
      },
    });

    // appsyncGraphQlClient.mutate()
  }, 10000);
});
