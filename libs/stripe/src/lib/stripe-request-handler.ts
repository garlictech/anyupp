import { AppsyncApi } from '@bgap/api/graphql/schema';
import * as stripeService from './stripe.service';

interface WithStripeCustomer {
  stripeCustomerId: string;
}

type UpdateStripeCardRequest = WithStripeCustomer &
  AppsyncApi.MutationUpdateMyStripeCardArgs;

type DeleteStripeCardRequest = WithStripeCustomer &
  AppsyncApi.MutationDeleteMyStripeCardArgs;

export const stripeRequestHandler = {
  getStripeCardsForCustomer(
    requestPayload: unknown,
  ): Promise<AppsyncApi.StripeCard[]> {
    const { stripeCustomerId } = requestPayload as WithStripeCustomer;

    if (!stripeCustomerId) {
      return Promise.resolve([]);
    }

    return stripeService.getStripeCardsForCustomer(stripeCustomerId);
  },
  updateStripeCard(requestPayload: unknown): Promise<AppsyncApi.StripeCard> {
    const {
      stripeCustomerId,
      input,
    } = requestPayload as UpdateStripeCardRequest;

    if (!stripeCustomerId) {
      throw 'missing stripeCustomerId';
    }

    return stripeService.updateStripeCard(stripeCustomerId, input);
  },
  deleteStripeCard(requestPayload: unknown) {
    const {
      stripeCustomerId,
      input,
    } = requestPayload as DeleteStripeCardRequest;

    if (!stripeCustomerId) {
      throw 'missing stripeCustomerId';
    }

    return stripeService.deleteStripeCard(stripeCustomerId, input);
  },
};
