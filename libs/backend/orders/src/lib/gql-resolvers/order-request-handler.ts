import * as CrudApi from '@bgap/crud-gql/api';
import { createOrderFromCart } from './create-order-from-cart.resolver';
import { OrderResolverDeps } from './utils';

export const orderRequestHandler = (deps: OrderResolverDeps) => ({
  createOrderFromCart: (
    requestPayload: CrudApi.MutationCreateOrderFromCartArgs,
  ) => createOrderFromCart(requestPayload?.input?.id)(deps).toPromise(),
});
