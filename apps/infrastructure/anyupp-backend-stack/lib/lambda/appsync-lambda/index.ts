/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, Handler } from 'aws-lambda';
import { stripeRequestHandler } from '@bgap/api/stripe';
import * as resolvers from '@bgap/api/graphql/resolvers';
// import { orderRequestHandler } from '@bgap/api/order';
// import { amplifyGraphQlClient } from '@bgap/shared/graphql/api-client';

import * as fp from 'lodash/fp';

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

const resolverMap = {
  getStripeCardsForCustomer: stripeRequestHandler.getStripeCardsForCustomer,
  updateStripeCard: stripeRequestHandler.updateStripeCard,
  deleteStripeCard: stripeRequestHandler.deleteStripeCard,
  createAdminUser: resolvers.createAdminUser,
  deleteAdminUser: resolvers.deleteAdminUser,
  // createOrderFromCart: orderRequestHandler.createOrderFromCart,
};

export const handler: Handler<AnyuppRequest, unknown> = (
  event: AnyuppRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context,
): Promise<unknown> => {
  console.debug(
    '**** Executing lambda with event',
    JSON.stringify(event, null, 2),
  );

  console.debug(
    '**** Executing lambda with context',
    JSON.stringify(context, null, 2),
  );

  const resolver = fp.get(event.handler, resolverMap);

  if (resolver) {
    return resolver(event.payload);
  } else {
    throw 'Unknown graphql field';
  }
};

// const handleError = (error: Error | string) => {
//   if (typeof error === 'string') {
//     throw error;
//   }
//   throw JSON.stringify(error, undefined, 2);
// };
