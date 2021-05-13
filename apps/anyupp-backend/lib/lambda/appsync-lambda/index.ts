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
  const userPoolId = process.env.userPoolId || '';
  const awsAccesskeyId = process.env.AWS_ACCESS_KEY_ID || '';
  const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
  const crudSdk = getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
  const anyuppSdk = getAnyuppSdkForIAM(awsAccesskeyId, awsSecretAccessKey);

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

  const stripeRequestHandlers = stripeRequestHandler({
    crudSdk,
    anyuppSdk,
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
