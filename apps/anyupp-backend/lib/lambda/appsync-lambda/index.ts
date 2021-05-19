import { Context, Handler } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import * as fp from 'lodash/fp';

import {
  adminRequestHandler,
  orderRequestHandler,
  productRequestHandler,
  stripeRequestHandler,
  unitRequestHandler,
  userRequestHandler,
} from '@bgap/anyupp-gql/backend';
import { config } from '@bgap/shared/config';
import { crudBackendGraphQLClient } from '@bgap/shared/graphql/api-client';

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

const consumerUserPoolId = config.ConsumerUserPoolId;
const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: 'eu-west-1',
});

const resolverMap = {
  listStripeCards: stripeRequestHandler.listStripeCards(
    crudBackendGraphQLClient,
  ),
  startStripePayment: stripeRequestHandler.startStripePayment(
    crudBackendGraphQLClient,
  ),
  createAdminUser: adminRequestHandler.createAdminUser,
  deleteAdminUser: adminRequestHandler.deleteAdminUser,
  createOrderFromCart: orderRequestHandler.createOrderFromCart(
    crudBackendGraphQLClient,
  ),
  getUnitsNearLocation: unitRequestHandler.getUnitsNearLocation(
    crudBackendGraphQLClient,
  ),
  regenerateUnitData: unitRequestHandler.regenerateUnitData(
    crudBackendGraphQLClient,
  ),
  createUnitProduct: productRequestHandler.createUnitProduct(
    crudBackendGraphQLClient,
  ),
  createAnonymUser: userRequestHandler.createAnonymUser({
    crudGraphqlClient: crudBackendGraphQLClient,
    cognito: cognitoidentityserviceprovider,
    consumerUserPoolId: consumerUserPoolId,
  }),
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
