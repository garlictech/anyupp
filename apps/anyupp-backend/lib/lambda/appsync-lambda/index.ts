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
  createUnitResolver,
  updateUnitResolver,
  createUnitsDeps,
} from '@bgap/anyupp-gql/backend';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';
import { config } from '@bgap/shared/config';
import { Context, Handler } from 'aws-lambda';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { v1 as uuidV1 } from 'uuid';
import { tableConfig } from '@bgap/crud-gql/backend';
import { DynamoDB } from 'aws-sdk';

export interface AnyuppRequest {
  typeName: string;
  fieldName: string;
  arguments: unknown;
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
const szamlazzClient = createSzamlazzClient(process.env.SZAMLAZZ_HU_AGENT_KEY);
const stripeClient = createStripeClient(process.env.STRIPE_SECRET_KEY);
const unitsDeps = createUnitsDeps();
const docClient = new DynamoDB.DocumentClient();

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
    cognitoidentityserviceprovider,
    userNameGenerator: uuidV1,
    docClient,
    adminUserTableName: tableConfig.AdminUser.TableName,
  });

  const orderRequestHandlers = orderRequestHandler({
    crudSdk,
  });

  const unitRequestHandlers = unitRequestHandler(unitsDeps);

  const productRequestHandlers = productRequestHandler({
    crudSdk,
    regenerateUnitDataHandler: regenerateUnitData(unitsDeps),
    unitProductTableName: tableConfig.UnitProduct.TableName,
    chainProductTableName: tableConfig.ChainProduct.TableName,
    groupProductTableName: tableConfig.GroupProduct.TableName,
    docClient,
  });

  const stripeRequestHandlers = stripeRequestHandler({
    crudSdk,
    szamlazzClient,
    stripeClient,
  });

  const userRequestHandlers = userRequestHandler({
    crudSdk,
    consumerUserPoolId,
    cognitoidentityserviceprovider,
  });

  // We don't use typing here, we explicitly check the fields in runtime.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const resolverMap: any = {
    Mutation: {
      startStripePayment: stripeRequestHandlers.startStripePayment,
      createStripeCard: stripeRequestHandlers.createStripeCard,
      updateMyStripeCard: stripeRequestHandlers.updateStripeCard,
      deleteMyStripeCard: stripeRequestHandlers.deleteStripeCard,
      createAdminUser: adminUserRequestHandlers.createAdminUser,
      deleteAdminUser: adminUserRequestHandlers.deleteAdminUser,
      createOrderFromCart: orderRequestHandlers.createOrderFromCart,
      regenerateUnitData: unitRequestHandlers.regenerateUnitData,
      createUnitProduct: productRequestHandlers.createUnitProduct,
      updateUnitProduct: productRequestHandlers.updateUnitProduct,
      deleteUnitProduct: productRequestHandlers.deleteUnitProduct,
      updateChainProduct: productRequestHandlers.updateChainProduct,
      updateGroupProduct: productRequestHandlers.updateGroupProduct,
      createAnonymUser: userRequestHandlers.createAnonymUser,
      createUnit: createUnitResolver(unitsDeps),
      updateUnit: updateUnitResolver(unitsDeps),
    },
    Query: {
      listStripeCards: stripeRequestHandlers.listStripeCards,
      getUnitsNearLocation: unitRequestHandlers.getUnitsNearLocation,
    },
  };

  const op = resolverMap[event.typeName]?.[event.fieldName]?.(event.arguments);

  if (op === undefined) {
    return Promise.reject(
      'Unknown graphql field in the appsync-lambda handler',
    );
  } else if (op.toPromise === 'function') {
    return op.toPromise();
  } else {
    return op;
  }
};
