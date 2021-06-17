import { Context, Handler } from 'aws-lambda';
import * as fp from 'lodash/fp';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';
import { getAnyuppSdkForIAM } from '@bgap/anyupp-gql/api';

import {
  adminRequestHandler,
  createStripeClient,
  orderRequestHandler,
  productRequestHandler,
  stripeRequestHandler,
  unitRequestHandler,
  userRequestHandler,
} from '@bgap/anyupp-gql/backend';
import { config } from '@bgap/shared/config';
import { createSzamlazzClient } from '@bgap/anyupp-gql/backend';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { v1 as uuidV1 } from 'uuid';

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

if (!process.env.STRIPE_SECRET_KEY) {
  throw Error(
    'Stripe secret key not found in lambda environment. Add itt with the name STRIPE_SECRET_KEY',
  );
}

if (!process.env.SZAMLAZZ_HU_AGENT_KEY) {
  throw Error(
    'SzamlazzHu agent key not found in lambda environment. Add itt with the name SZAMLAZZ_HU_AGENT_KEY',
  );
}

const consumerUserPoolId = config.ConsumerUserPoolId;
const userPoolId = process.env.userPoolId || '';
const awsAccesskeyId = 'AKIAYIT7GMY5WQZFXOOX'; // process.env.AWS_ACCESS_KEY_ID || '';
const awsSecretAccessKey = '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'; // process.env.AWS_SECRET_ACCESS_KEY || '';
const crudSdk = getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
const anyuppSdk = getAnyuppSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
const szamlazzClient = createSzamlazzClient(process.env.SZAMLAZZ_HU_AGENT_KEY);
const stripeClient = createStripeClient(process.env.STRIPE_SECRET_KEY);

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.AWS_REGION || '',
});

export const handler: Handler<AnyuppRequest, unknown> = (
  event: AnyuppRequest,
  _context: Context,
): Promise<unknown> => {
  const adminUserRequestHandlers = adminRequestHandler({
    userPoolId,
    crudSdk,
    cognitoidentityserviceprovider,
    userNameGenerator: uuidV1,
  });

  const orderRequestHandlers = orderRequestHandler({
    crudSdk,
  });

  const unitRequestHandlers = unitRequestHandler({
    crudSdk,
  });

  const productRequestHandlers = productRequestHandler({
    crudSdk,
  });

  const stripeRequestHandlers = stripeRequestHandler({
    crudSdk,
    anyuppSdk,
    szamlazzClient,
    stripeClient,
  });

  const userRequestHandlers = userRequestHandler({
    anyuppSdk,
    consumerUserPoolId,
    cognitoidentityserviceprovider,
  });

  const resolverMap = {
    listStripeCards: stripeRequestHandlers.listStripeCards,
    startStripePayment: stripeRequestHandlers.startStripePayment,
    createAdminUser: adminUserRequestHandlers.createAdminUser,
    deleteAdminUser: adminUserRequestHandlers.deleteAdminUser,
    createOrderFromCart: orderRequestHandlers.createOrderFromCart,
    getUnitsNearLocation: unitRequestHandlers.getUnitsNearLocation,
    regenerateUnitData: unitRequestHandlers.regenerateUnitData,
    createUnitProduct: productRequestHandlers.createUnitProduct,
    createAnonymUser: userRequestHandlers.createAnonymUser,
  };

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
