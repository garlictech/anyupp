import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';
import { missingParametersCheck } from '@bgap/shared/utils';

import { createOrderFromCart } from './create-order-from-cart.resolver';

interface WithAuthenticatedUser {
  userId: string;
}
export type CreateOrderFromCartRequest = WithAuthenticatedUser &
  AnyuppApi.MutationCreateOrderFromCartArgs;

export const orderRequestHandler = {
  createOrderFromCart: (amplifyGraphQlClient: GraphqlApiClient) => (
    requestPayload: CreateOrderFromCartRequest,
  ) => {
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
      amplifyGraphQlClient,
    }).toPromise();
  },
};
