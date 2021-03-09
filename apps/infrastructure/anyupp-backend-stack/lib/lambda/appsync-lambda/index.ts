import { Context, Handler } from 'aws-lambda';
import { stripeRequestHandler } from '@bgap/stripe';
import { orderRequestHandler } from '@bgap/api/order';

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

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
      return orderRequestHandler.createOrderFromCart(event.payload);
    }
    default:
      throw 'missing handler';
  }
};
