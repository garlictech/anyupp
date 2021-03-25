import { AppsyncApi } from '@bgap/api/graphql/schema';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';
import { missingParametersCheck } from '@bgap/shared/utils';
import * as orderService from './order.service';

interface WithAuthenticatedUser {
  userId: string;
}
export type CreateOrderFromCartRequest = WithAuthenticatedUser &
  AppsyncApi.MutationCreateOrderFromCartArgs;

export const orderRequestHandler = {
  createOrderFromCart({
    requestPayload,
    amplifyGraphQlClient,
  }: {
    requestPayload: CreateOrderFromCartRequest;
    amplifyGraphQlClient: GraphqlApiClient;
  }) {
    missingParametersCheck<CreateOrderFromCartRequest>(requestPayload, [
      'userId',
      'input',
    ]);
    missingParametersCheck<AppsyncApi.CreateOrderFromCartInput>(
      requestPayload.input,
      ['id'],
    );

    return orderService.createOrderFromCart({
      userId: requestPayload.userId,
      cartId: requestPayload.input.id,
      amplifyGraphQlClient,
    });
  },
};
