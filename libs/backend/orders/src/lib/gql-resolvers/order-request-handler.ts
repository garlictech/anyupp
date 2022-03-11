import * as CrudApi from '@bgap/crud-gql/api';
import { createOrderFromCart } from './create-order-from-cart.resolver';
import { createOrder } from './create-order.resolver';
import { OrderResolverDeps } from './utils';

export const orderRequestHandler = (deps: OrderResolverDeps) => ({
  createOrderFromCart: (
    requestPayload: CrudApi.MutationCreateOrderFromCartArgs,
  ) => createOrderFromCart(requestPayload?.input?.id)(deps),

  createOrder: (requestPayload: CrudApi.MutationCreateOrderArgs) =>
    createOrder(requestPayload?.input)(deps),
});
