import { Context, Handler } from 'aws-lambda';
import * as fp from 'lodash/fp';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';
import { getAnyuppSdkForIAM } from '@bgap/anyupp-gql/api';

import {
  adminRequestHandler,
  orderRequestHandler,
  productRequestHandler,
  stripeRequestHandler,
  unitRequestHandler,
  userRequestHandler,
} from '@bgap/anyupp-gql/backend';
import { config } from '@bgap/shared/config';
import { createSzamlazzClient } from '@bgap/anyupp-gql/backend';

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

const consumerUserPoolId = config.ConsumerUserPoolId;
const userPoolId = process.env.userPoolId || '';
const awsAccesskeyId = 'AKIAYIT7GMY5WQZFXOOX'; // process.env.AWS_ACCESS_KEY_ID || '';
const awsSecretAccessKey = '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'; // process.env.AWS_SECRET_ACCESS_KEY || '';
const crudSdk = getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
const anyuppSdk = getAnyuppSdkForIAM(awsAccesskeyId, awsSecretAccessKey);

export const handler: Handler<AnyuppRequest, unknown> = (
  event: AnyuppRequest,
  _context: Context,
): Promise<unknown> => {
  const adminUserRequestHandlers = adminRequestHandler({
    userPoolId,
    crudSdk,
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

  if (!process.env.SZAMLAZZ_HU_AGENT_KEY) {
    throw Error(
      'SzamlazzHu agent key not found in lambda environment. Add itt with the name SZAMLAZZ_HU_AGENT_KEY',
    );
  }

  const szamlazzClient = createSzamlazzClient(
    process.env.SZAMLAZZ_HU_AGENT_KEY,
  );
  const stripeRequestHandlers = stripeRequestHandler({
    crudSdk,
    anyuppSdk,
    szamlazzClient,
  });

  const userRequestHandlers = userRequestHandler({
    anyuppSdk,
    consumerUserPoolId,
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
