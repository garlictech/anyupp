import { GraphqlApiFp } from '@bgap/shared/graphql/api-client';
import { Context, Handler } from 'aws-lambda';
import * as fp from 'lodash/fp';
import { awsConfig } from '@bgap/crud-gql/api';

import {
  adminRequestHandler,
  orderRequestHandler,
  productRequestHandler,
  stripeRequestHandler,
  unitRequestHandler,
} from '@bgap/anyupp-gql/backend';

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

export const handler: Handler<AnyuppRequest, unknown> = (
  event: AnyuppRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _context: Context,
): Promise<unknown> => {
  const crudBackendGraphQLClient = GraphqlApiFp.createBackendClient(
    awsConfig,
    process.env.AWS_ACCESS_KEY_ID || '',
    process.env.AWS_SECRET_ACCESS_KEY || '',
    console,
  );

  const resolverMap = {
    getStripeCardsForCustomer: stripeRequestHandler.getStripeCardsForCustomer,
    updateStripeCard: stripeRequestHandler.updateStripeCard,
    deleteStripeCard: stripeRequestHandler.deleteStripeCard,
    createAdminUser: adminRequestHandler.createAdminUser,
    deleteAdminUser: adminRequestHandler.deleteAdminUser,
    createOrderFromCart: orderRequestHandler.createOrderFromCart(
      crudBackendGraphQLClient,
    ),
    getUnitsNearLocation: unitRequestHandler.getUnitsNearLocation(
      crudBackendGraphQLClient,
    ),
    createUnitProduct: productRequestHandler.createUnitProduct(
      crudBackendGraphQLClient,
    ),
  };
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
