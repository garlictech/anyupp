import { Context, Handler } from 'aws-lambda';
import { stripeRequestHandler } from '@bgap/stripe';
import { orderRequestHandler } from '@bgap/api/order';
import { GraphqlApiFp } from '@bgap/shared/graphql/api-client';
import { IAmplifyApiConfig } from '@bgap/shared/types';
import { CONFIG } from '@bgap/shared/config';

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

export const AWS_CONFIG: IAmplifyApiConfig = {
  aws_appsync_graphqlEndpoint: CONFIG.GraphqlApiUrlAmplify,
  api_key: CONFIG.GraphqlApiKeyAmplify,
  aws_appsync_region: 'eu-west-1',
  aws_project_region: 'eu-west-1',
  aws_cognito_region: 'eu-west-1',
  aws_user_pools_id: CONFIG.UserPoolId,
  aws_user_pools_web_client_id: CONFIG.UserPoolClientId,
};

export const backendGraphQlClient = GraphqlApiFp.createPublicClient(
  AWS_CONFIG,
  console,
  true,
);

export const handler: Handler<AnyuppRequest, unknown> = (
  event: AnyuppRequest,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  context: Context,
): Promise<unknown> => {
  console.log(
    '**** Executing lambda with event',
    JSON.stringify(event, null, 2),
  );

  console.log(
    '**** Executing lambda with context',
    JSON.stringify(context, null, 2),
  );

  switch (event.handler) {
    case 'getStripeCardsForCustomer': {
      console.log('Handling getStripeCardsForCustomer');
      return stripeRequestHandler.getStripeCardsForCustomer(event.payload);
    }
    case 'updateStripeCard': {
      console.log('Handling updateStripeCard');
      return stripeRequestHandler.updateStripeCard(event.payload);
    }
    case 'deleteStripeCard': {
      console.log('Handling deleteStripeCard');
      return stripeRequestHandler.deleteStripeCard(event.payload);
    }
    case 'startStripePayment': {
      console.log('Handling startStripePayment');
      return stripeRequestHandler.startStripePayment(event.payload);
    }
    case 'createOrderFromCart': {
      console.log('Handling createOrderFromCart');
      return orderRequestHandler.createOrderFromCart(
        event.payload,
        backendGraphQlClient,
      );
    }
    default:
      throw 'missing handler';
  }
};
