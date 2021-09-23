import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { validateSchema } from '@bgap/shared/data-validators';
import Joi from 'joi';
import { switchMap } from 'rxjs/operators';
import { createOrderFromCart } from './create-order-from-cart.resolver';
import { OrderResolverDeps } from './utils';

interface WithAuthenticatedUser {
  userId: string;
}
export type CreateOrderFromCartRequest = WithAuthenticatedUser &
  AnyuppApi.MutationCreateOrderFromCartArgs;

const { validate: validateCreateOrderFromCartRequest } =
  validateSchema<AnyuppApi.CreateOrderFromCartMutationVariables>(
    {
      userId: Joi.string().required(),
      input: Joi.object({
        id: Joi.string().required(),
      }).required(),
    },
    'CreateOrderFromCartRequest',
  );

export const orderRequestHandler = (deps: OrderResolverDeps) => ({
  createOrderFromCart: (requestPayload: CreateOrderFromCartRequest) =>
    validateCreateOrderFromCartRequest(requestPayload)
      .pipe(
        switchMap(() =>
          createOrderFromCart(
            requestPayload.userId,
            requestPayload.input.id,
          )(deps),
        ),
      )
      .toPromise(),
});
