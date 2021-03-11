import { AppsyncApi } from '@bgap/api/graphql/schema';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';
import { missingParametersCheck } from '@bgap/shared/utils';
import * as orderService from './order.service';

interface WithAuthenticatedUser {
  userId: string;
}
export type CreateOrderFromCartRequest = WithAuthenticatedUser &
  AppsyncApi.MutationCreateOrderFromCartArgs & {
    currency: string;
  };

export const orderRequestHandler = {
  createOrderFromCart(
    requestPayload: CreateOrderFromCartRequest,
    graphqlApiClient: GraphqlApiClient,
  ) {
    missingParametersCheck<CreateOrderFromCartRequest>(requestPayload, [
      'userId',
      'currency',
      'input',
    ]);
    missingParametersCheck<AppsyncApi.CreateOrderFromCartInput>(
      requestPayload.input,
      ['unitId', 'paymentMethod', 'place', 'cartItems'],
    );
    missingParametersCheck<AppsyncApi.PlaceInput>(requestPayload.input.place, [
      'seat',
      'table',
    ]);

    return orderService.createOrderFromCart({
      ...requestPayload,
      ...requestPayload.input,
      graphqlApiClient,
    });
  },
};
