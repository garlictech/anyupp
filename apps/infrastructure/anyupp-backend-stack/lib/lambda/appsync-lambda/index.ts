/* eslint-disable @typescript-eslint/no-explicit-any */
import { Context, Handler } from 'aws-lambda';
import { stripeRequestHandler } from '@bgap/api/stripe';
import { orderRequestHandler } from '@bgap/api/order';
import { amplifyGraphQlClient } from '@bgap/shared/graphql/api-client';

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

const handleError = (error: Error | string) => {
  if (typeof error === 'string') {
    throw error;
  }
  throw JSON.stringify(error, undefined, 2);
};

export const handler: Handler<AnyuppRequest, unknown> = async (
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
      return stripeRequestHandler
        .getStripeCardsForCustomer(event.payload)
        .catch(handleError);
    }
    case 'updateStripeCard': {
      console.log('Handling updateStripeCard');
      return stripeRequestHandler
        .updateStripeCard(event.payload)
        .catch(handleError);
    }
    case 'deleteStripeCard': {
      console.log('Handling deleteStripeCard');
      return stripeRequestHandler
        .deleteStripeCard(event.payload)
        .catch(handleError);
    }
    case 'startStripePayment': {
      console.log('Handling startStripePayment');
      return stripeRequestHandler
        .startStripePayment(event.payload)
        .catch(handleError);
    }
    case 'createOrderFromCart': {
      console.log('Handling createOrderFromCart');
      return orderRequestHandler
        .createOrderFromCart(event.payload as any, amplifyGraphQlClient)
        .catch(handleError);
    }
    default:
      throw 'missing handler';
  }
};
