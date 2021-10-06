import bcrypt from 'bcryptjs';
import { tableConfig } from '@bgap/crud-gql/backend';
import { getCrudSdkForIAM, regenerateUnitData } from '@bgap/crud-gql/api';
import { config } from '@bgap/shared/config';
import { Context, Handler } from 'aws-lambda';
import CognitoIdentityServiceProvider from 'aws-sdk/clients/cognitoidentityserviceprovider';
import { v1 as uuidV1 } from 'uuid';
import { DynamoDB } from 'aws-sdk';
import {
  createSzamlazzClient,
  createStripeClient,
  adminRequestHandler,
  orderRequestHandler,
  UnitsResolverDeps,
  unitRequestHandler,
  productRequestHandler,
  stripeRequestHandler,
  userRequestHandler,
  createUnitResolver,
  updateUnitResolver,
} from '..';

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
const crudSdk = getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
const szamlazzClient = createSzamlazzClient(process.env.SZAMLAZZ_HU_AGENT_KEY);
const stripeClient = createStripeClient(process.env.STRIPE_SECRET_KEY);

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.AWS_REGION || '',
});

const salt = process.env.SALT || '';
const docClient = new DynamoDB.DocumentClient();
const hashGenerator = (password: string) => bcrypt.hashSync(password, salt);

const uuidGenerator = uuidV1;

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

  const unitsDeps: UnitsResolverDeps = {
    hashGenerator,
    uuidGenerator,
    tableName: tableConfig.Unit.TableName,
    docClient,
    crudSdk,
  };

  const unitRequestHandlers = unitRequestHandler(unitsDeps);

  const productRequestHandlers = productRequestHandler({
    crudSdk,
    regenerateUnitDataHandler: regenerateUnitData(unitsDeps),
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

  // We don't care the erorr content for the moment
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleError = (error: any) => {
    throw error?.message ?? error;
  };

  return (
    resolverMap[event.typeName]
      ?.[event.fieldName]?.(event.arguments)
      ?.catch(handleError) ??
    Promise.reject('Unknown graphql field in the appsync-lambda handler')
  );
};
