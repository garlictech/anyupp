import {
  MutationCreateOrderFromCartArgs,
  MutationCreateOrderArgs,
} from '@bgap/domain';

import { createOrderFromCart } from './create-order-from-cart.resolver';
import { createOrder } from './create-order.resolver';
import { OrderResolverDeps } from './utils';

export const orderRequestHandler = (deps: OrderResolverDeps) => ({
  createOrderFromCart: (requestPayload: MutationCreateOrderFromCartArgs) =>
    createOrderFromCart(requestPayload?.input?.id)(deps),

  createOrder: (requestPayload: MutationCreateOrderArgs) =>
    createOrder(requestPayload?.input)(deps),
});
