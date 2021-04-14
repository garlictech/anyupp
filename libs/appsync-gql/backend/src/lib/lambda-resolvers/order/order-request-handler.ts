import { AppsyncApi } from '@bgap/api/appsync-gql';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';
import { missingParametersCheck } from '@bgap/shared/utils';

import { createOrderFromCart } from './create-order-from-cart.resolver';

interface WithAuthenticatedUser {
  userId: string;
}
export type CreateOrderFromCartRequest = WithAuthenticatedUser &
  AppsyncApi.MutationCreateOrderFromCartArgs;

export const orderRequestHandler = {
  createOrderFromCart: (amplifyGraphQlClient: GraphqlApiClient) => (
    requestPayload: CreateOrderFromCartRequest,
  ) => {
    missingParametersCheck<CreateOrderFromCartRequest>(requestPayload, [
      'userId',
      'input',
    ]);
    missingParametersCheck<AppsyncApi.CreateOrderFromCartInput>(
      requestPayload.input,
      ['id'],
    );

    return createOrderFromCart({
      userId: requestPayload.userId,
      cartId: requestPayload.input.id,
      amplifyGraphQlClient,
    }).toPromise();
  },
};
