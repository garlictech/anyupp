import { getAnyuppSdkForIAM } from '@bgap/anyupp-gql/api';
import {
  adminRequestHandler,
  createStripeClient,
  createSzamlazzClient,
  orderRequestHandler,
  productRequestHandler,
  regenerateUnitData,
  stripeRequestHandler,
  unitRequestHandler,
  userRequestHandler,
} from '@bgap/anyupp-gql/backend';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';
import { config } from '@bgap/shared/config';
import { Context, Handler } from 'aws-lambda';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import * as fp from 'lodash/fp';
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
const awsAccesskeyId = process.env.API_ACCESS_KEY_ID || '';
const awsSecretAccessKey = process.env.API_SECRET_ACCESS_KEY || '';
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
  console.debug('### Appsync Lambda handler ~ event:AnyuppRequest', event);

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
    regenerateUnitDataHandler: regenerateUnitData({ crudSdk }),
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
    createStripeCard: stripeRequestHandlers.createStripeCard,
    updateMyStripeCard: stripeRequestHandlers.updateStripeCard,
    deleteMyStripeCard: stripeRequestHandlers.deleteStripeCard,
    createAdminUser: adminUserRequestHandlers.createAdminUser,
    deleteAdminUser: adminUserRequestHandlers.deleteAdminUser,
    createOrderFromCart: orderRequestHandlers.createOrderFromCart,
    getUnitsNearLocation: unitRequestHandlers.getUnitsNearLocation,
    regenerateUnitData: unitRequestHandlers.regenerateUnitData,
    createUnitProduct: productRequestHandlers.createUnitProduct,
    updateUnitProduct: productRequestHandlers.updateUnitProduct,
    deleteUnitProduct: productRequestHandlers.deleteUnitProduct,
    updateChainProduct: productRequestHandlers.updateChainProduct,
    updateGroupProduct: productRequestHandlers.updateGroupProduct,
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
