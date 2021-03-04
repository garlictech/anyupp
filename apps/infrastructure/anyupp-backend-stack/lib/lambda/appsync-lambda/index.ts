import { Context, Handler } from 'aws-lambda';
import { stripeService } from '@bgap/stripe';
import { AppsyncApi } from '@bgap/api/graphql/schema';

interface WithStripeCustomer {
  stripeCustomerId: string;
}

type UpdateStripeCardRequest = WithStripeCustomer &
  AppsyncApi.MutationUpdateMyStripeCardArgs;

type DeleteStripeCardRequest = WithStripeCustomer &
  AppsyncApi.MutationDeleteMyStripeCardArgs;

export interface AnyuppRequest {
  handler: string;
  payload: unknown;
}

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
      const { stripeCustomerId } = event.payload as WithStripeCustomer;

      if (!stripeCustomerId) {
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
    case 'deleteStripeCard': {
      console.log('Handling deleteStripeCard');
      const {
        stripeCustomerId,
        input,
      } = event.payload as DeleteStripeCardRequest;

      if (!stripeCustomerId) {
        throw 'missing stripeCustomerId';
      }

      return stripeService.deleteStripeCard(stripeCustomerId, input);
    }
    default:
      throw 'missing handler';
  }
};
