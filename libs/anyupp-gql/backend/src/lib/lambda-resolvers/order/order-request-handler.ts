import * as CrudApi from '@bgap/crud-gql/api';
import { validateSchema } from '@bgap/shared/data-validators';
import Joi from 'joi';
import { switchMap } from 'rxjs/operators';
import { createOrderFromCart } from './create-order-from-cart.resolver';
import { OrderResolverDeps } from './utils';

interface WithAuthenticatedUser {
  userId: string;
}
export type CreateOrderFromCartRequest = WithAuthenticatedUser &
  CrudApi.MutationCreateOrderFromCartArgs;

export const orderRequestHandler = (deps: OrderResolverDeps) => ({
  createOrderFromCart: (requestPayload: CreateOrderFromCartRequest) =>
    createOrderFromCart(
      requestPayload?.userId,
      requestPayload?.input?.id,
    )(deps).toPromise(),
});
