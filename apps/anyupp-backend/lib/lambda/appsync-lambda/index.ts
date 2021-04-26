import {Context, Handler} from 'aws-lambda';
import * as fp from 'lodash/fp';

import {
  adminRequestHandler,
  orderRequestHandler,
  productRequestHandler,
  stripeRequestHandler,
  unitRequestHandler,
} from '@bgap/anyupp-gql/backend';
import {crudBackendGraphQLClient} from '@bgap/shared/graphql/api-client';

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

// HOW TO IMPORT CRUD API TABLE ARNS
import {tableConfig} from '@bgap/crud-gql/backend';
console.log('THE UNIT TABLE ARN: ', tableConfig.Unit);

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
