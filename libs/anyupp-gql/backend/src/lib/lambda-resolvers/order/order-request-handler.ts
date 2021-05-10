import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { missingParametersCheck } from '@bgap/shared/utils';
import { OrderResolverDeps } from './utils';
import { createOrderFromCart } from './create-order-from-cart.resolver';

interface WithAuthenticatedUser {
  userId: string;
}
export type CreateOrderFromCartRequest = WithAuthenticatedUser &
  AnyuppApi.MutationCreateOrderFromCartArgs;

export const orderRequestHandler = (deps: OrderResolverDeps) => ({
  createOrderFromCart: (requestPayload: CreateOrderFromCartRequest) => {
    missingParametersCheck<CreateOrderFromCartRequest>(requestPayload, [
      'userId',
      'input',
    ]);
    missingParametersCheck<AnyuppApi.CreateOrderFromCartInput>(
      requestPayload.input,
      ['id'],
    );

    return createOrderFromCart({
      userId: requestPayload.userId,
      cartId: requestPayload.input.id,
    })(deps).toPromise();
  },
});
