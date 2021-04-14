import { Context, Handler } from 'aws-lambda';
import * as fp from 'lodash/fp';

import {
  adminRequestHandler,
  orderRequestHandler,
  stripeRequestHandler,
  unitRequestHandler,
} from '@bgap/appsync-gql/backend';
import { amplifyGraphQlClient } from '@bgap/shared/graphql/api-client';

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

const resolverMap = {
  getStripeCardsForCustomer: stripeRequestHandler.getStripeCardsForCustomer,
  updateStripeCard: stripeRequestHandler.updateStripeCard,
  deleteStripeCard: stripeRequestHandler.deleteStripeCard,
  createAdminUser: adminRequestHandler.createAdminUser,
  deleteAdminUser: adminRequestHandler.deleteAdminUser,
  createOrderFromCart: orderRequestHandler.createOrderFromCart(
    amplifyGraphQlClient,
  ),
  getUnitsNearLocation: unitRequestHandler.getUnitsNearLocation(
    amplifyGraphQlClient,
  ),
};

export const handler: Handler<AnyuppRequest, unknown> = (
  event: AnyuppRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context,
): Promise<unknown> => {
  // console.debug(
  //   '**** Executing lambda with event',
  //   JSON.stringify(event, null, 2),
  // );
  // console.debug(
  //   '**** Executing lambda with context',
  //   JSON.stringify(context, null, 2),
  // );

  const resolver = fp.get(event.handler, resolverMap);

  if (resolver) {
    return resolver(event.payload).catch(handleError);
  } else {
    throw 'Unknown graphql field in the appsync-lambda handler';
  }
};

const handleError = (error: Error | string) => {
  if (typeof error === 'string') {
    throw error;
  }
  throw error.message;
};
