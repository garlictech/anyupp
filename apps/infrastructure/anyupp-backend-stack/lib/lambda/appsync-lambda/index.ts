/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, Handler } from 'aws-lambda';
import { stripeRequestHandler } from '@bgap/api/stripe';
import { orderRequestHandler } from '@bgap/api/order';
import { GraphqlApiFp } from '@bgap/shared/graphql/api-client';
import { IAmplifyApiConfig } from '@bgap/shared/types';
import { awsConfig } from '@bgap/admin/amplify-api';

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

export const AWS_CONFIG: IAmplifyApiConfig = {
  api_key: awsConfig.aws_appsync_apiKey,
  ...awsConfig,
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
        event.payload as any,
        backendGraphQlClient,
      );
    }
    default:
      throw 'missing handler';
  }
};
