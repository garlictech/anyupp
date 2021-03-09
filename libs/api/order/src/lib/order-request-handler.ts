import { AppsyncApi } from '@bgap/api/graphql/schema';
import { missingParametersCheck } from '@bgap/shared/utils';
import * as orderService from './order.service';

interface WithAuthenticatedUser {
  userId: string;
}
type CreateOrderFromCartRequest = WithAuthenticatedUser &
  AppsyncApi.MutationCreateOrderFromCartArgs;

export const orderRequestHandler = {
  createOrderFromCart(requestPayload: unknown) {
    const { userId, input } = requestPayload as CreateOrderFromCartRequest;

    missingParametersCheck(requestPayload, ['userId']);
    missingParametersCheck(input, [
      'unitId',
      'paymentMethod',
      'place',
      'cartItems',
    ]);

    return orderService.createOrderFromCart(userId, input);
  },
};
