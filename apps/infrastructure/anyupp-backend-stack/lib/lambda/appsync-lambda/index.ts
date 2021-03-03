import { Context, Handler } from 'aws-lambda';
import { stripeService } from '@bgap/stripe';
import { AppsyncApi } from '@bgap/api/graphql/schema';

interface WithStripeCustomer {
  stripeCustomerId: string;
}

export interface UpdateStripeCardRequest
  extends WithStripeCustomer,
    AppsyncApi.MutationUpdateMyStripeCardArgs {}

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
      const { stripeCustomerId } = event.payload as WithStripeCustomer;

      if (!stripeCustomerId) {
        // throw 'missing stripeCustomerId';
        return [];
      }

      return stripeService.getStripeCardsForCustomer(stripeCustomerId);
    }
    case 'updateStripeCard': {
      console.log('Handling updateStripeCard');
      const {
        stripeCustomerId,
        input,
      } = event.payload as UpdateStripeCardRequest;

      if (!stripeCustomerId) {
        throw 'missing stripeCustomerId';
      }

      return stripeService.updateStripeCard(stripeCustomerId, input);
    }
    default:
      throw 'up';
  }
};

// const getStripeCustomerIdFromPayloadOrThrow = (payload: WithStripeCustomer) => {
//   const {stripeCustomerId} = (payload as UpdateStripeCardRequest);

//   if (!stripeCustomerId) {
//     throw 'missing stripeCustomerId';
//   }
// }
