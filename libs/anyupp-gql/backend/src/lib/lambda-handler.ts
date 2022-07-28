import axios from 'axios';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';
import { config } from '@bgap/shared/config';
import { Context, Handler } from 'aws-lambda';
import { CognitoIdentityServiceProvider } from 'aws-sdk';
import { v1 as uuidV1 } from 'uuid';
import { tableConfig } from '@bgap/crud-gql/backend';
import { DynamoDB } from 'aws-sdk';
import { Observable } from 'rxjs';
import {
  createUnitResolver,
  createUnitsDeps,
  unitRequestHandler,
  updateUnitResolver,
} from '@bgap/backend/units';
import { createSzamlazzClient } from './szamlazzhu';
import {
  createStripeClient,
  stripeRequestHandler,
} from './lambda-resolvers/stripe';
import { adminRequestHandler } from './lambda-resolvers/admin-user';
import { orderRequestHandler } from '@bgap/backend/orders';
import { userRequestHandler } from './lambda-resolvers/user';
import { updateUnitRKeeperDataResolver } from '@bgap/backend/units';
/* eslint-disable @typescript-eslint/no-var-requires */
const { createConnector } = require('aws-elasticsearch-js');
import { Client } from '@elastic/elasticsearch';
import { CrudApiConfig } from '@bgap/crud-gql/api';
import { searchByRadiusResolver } from '@bgap/backend/search';
import { productVariantsResolver } from '@bgap/backend/products';

export type AnyuppRequest<SOURCE = undefined> = {
  typeName: string;
  fieldName: string;
  identity?: {
    username?: string;
  };
  arguments: unknown;
  source?: SOURCE;
};

const consumerUserPoolId = config.ConsumerUserPoolId;
const userPoolId = process.env.userPoolId || '';
const awsAccesskeyId = process.env.API_ACCESS_KEY_ID || '';
const awsSecretAccessKey = process.env.API_SECRET_ACCESS_KEY || '';
const crudSdk = getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey);
const unitsDeps = createUnitsDeps(crudSdk);
const docClient = new DynamoDB.DocumentClient();

const cognitoidentityserviceprovider = new CognitoIdentityServiceProvider({
  apiVersion: '2016-04-18',
  region: process.env.AWS_REGION || '',
});

const searchDeps = {
  osClient: new Client({
    nodes: [CrudApiConfig.openSearchEndpoint],
    Connection: createConnector({ region: process.env.AWS_REGION || '' }),
  }),
};

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
    orderTableName: tableConfig.Order.TableName,
    unitTableName: tableConfig.Unit.TableName,
    currentTimeISOString: () => new Date().toISOString(),
    random: Math.random,
    axiosInstance: axios,
    uuid: () => uuidV1(),
    docClient,
    userId: event.identity?.username || '',
  });

  const unitRequestHandlers = unitRequestHandler(unitsDeps.crudSdk);

  const stripeRequestHandlers = stripeRequestHandler({
    crudSdk,
    szamlazzClient,
    stripeClient,
    userId: event.identity?.username || '',
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
      startStripePaymentConnected: stripeRequestHandlers.startStripePayment,
      payTipWithStripe: stripeRequestHandlers.payTipWithStripe,
      createStripeCard: stripeRequestHandlers.createStripeCard,
      updateMyStripeCard: stripeRequestHandlers.updateStripeCard,
      deleteMyStripeCard: stripeRequestHandlers.deleteStripeCard,
      createAdminUser: adminUserRequestHandlers.createAdminUser,
      deleteAdminUser: adminUserRequestHandlers.deleteAdminUser,
      createOrderFromCart: orderRequestHandlers.createOrderFromCart,
      createOrder: orderRequestHandlers.createOrder,
      regenerateUnitData: unitRequestHandlers.regenerateUnitData,
      createAnonymUser: userRequestHandlers.createAnonymUser,
      createUnit: createUnitResolver(unitsDeps),
      updateUnit: updateUnitResolver(unitsDeps),
      updateUnitRKeeperData: updateUnitRKeeperDataResolver(unitsDeps),
    },
    Query: {
      listStripeCards: stripeRequestHandlers.listStripeCards,
      getUnitsNearLocation: unitRequestHandlers.getUnitsNearLocation,
      searchByRadius: searchByRadiusResolver(searchDeps),
    },
    UnitProduct: {
      variants: productVariantsResolver({ crudSdk }),
    },
  };

  const op = resolverMap[event.typeName]?.[event.fieldName]?.(
    event.arguments,
    event.source,
  );

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
