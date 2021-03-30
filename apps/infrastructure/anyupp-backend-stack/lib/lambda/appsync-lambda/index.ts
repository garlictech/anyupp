import { Context, Handler } from 'aws-lambda';
import { stripeRequestHandler } from '@bgap/stripe';
import * as resolvers from '@bgap/api/graphql/resolvers';

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
