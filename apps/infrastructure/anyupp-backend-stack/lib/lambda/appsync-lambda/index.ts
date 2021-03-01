import { Context, Handler } from 'aws-lambda';
import { stripeService } from '@bgap/stripe';

export interface GetStripeCardsCustomerRequest {
  stripeCustomerId: string;
}

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

export const handler: Handler<AnyuppRequest, unknown> = async (
  event: AnyuppRequest,
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
      const stripeCustomerId = (event.payload as GetStripeCardsCustomerRequest)
        .stripeCustomerId;

      if (!stripeCustomerId) {
        // throw 'missing stripeCustomerId';
        return [];
      }

      return stripeService.getStripeCardsForCustomer(stripeCustomerId);
    }
    default:
      throw 'up';
  }
};
