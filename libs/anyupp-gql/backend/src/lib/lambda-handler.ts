import {
  adminRequestHandler,
  createStripeClient,
  createSzamlazzClient,
  orderRequestHandler,
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
import { Observable } from 'rxjs';

export interface AnyuppRequest {
  typeName: string;
  fieldName: string;
  identity?: {
    username?: string;
  };
  arguments: unknown;
}

const consumerUserPoolId = config.ConsumerUserPoolId;
const userPoolId = process.env.userPoolId || '';
const awsAccesskeyId = process.env.API_ACCESS_KEY_ID || '';
const awsSecretAccessKey = process.env.API_SECRET_ACCESS_KEY || '';
const crudSdk = getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
const unitsDeps = createUnitsDeps();
const docClient = new DynamoDB.DocumentClient();

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.AWS_REGION || '',
});

export const anyuppResolverHandler: Handler<AnyuppRequest, unknown> = (
  event: AnyuppRequest,
  _context: Context,
): Promise<unknown> => {
  console.debug('### Appsync Lambda handler ~ event:AnyuppRequest', event);
  const szamlazzClient = createSzamlazzClient(
    process.env.SZAMLAZZ_HU_AGENT_KEY || 'unknown key',
  );
  const stripeClient = createStripeClient(
    process.env.STRIPE_SECRET_KEY || 'unknown key',
  );

  const adminUserRequestHandlers = adminRequestHandler({
    userPoolId,
    cognitoidentityserviceprovider,
    userNameGenerator: uuidV1,
    docClient,
    adminUserTableName: tableConfig.AdminUser.TableName,
  });

  const orderRequestHandlers = orderRequestHandler({
    crudSdk,
    userId: event.identity?.username || '',
  });

  const unitRequestHandlers = unitRequestHandler(unitsDeps);

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
  } else if (op instanceof Observable) {
    return op.toPromise();
  } else {
    return op;
  }
};
