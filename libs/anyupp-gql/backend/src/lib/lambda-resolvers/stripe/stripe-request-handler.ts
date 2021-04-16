import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { missingParametersCheck } from '@bgap/shared/utils';
import * as stripeService from './stripe.service';

interface WithStripeCustomer {
  stripeCustomerId: string;
}
type UpdateStripeCardRequest = WithStripeCustomer &
  AnyuppApi.MutationUpdateMyStripeCardArgs;
type DeleteStripeCardRequest = WithStripeCustomer &
  AnyuppApi.MutationDeleteMyStripeCardArgs;
type StartStripePaymentRequest = WithStripeCustomer &
  AnyuppApi.MutationStartStripePaymentArgs;

export const stripeRequestHandler = {
  getStripeCardsForCustomer(
    requestPayload: unknown,
  ): Promise<AnyuppApi.StripeCard[]> {
    const { stripeCustomerId } = requestPayload as WithStripeCustomer;

    if (!stripeCustomerId) {
      return Promise.resolve([]);
    }

    return stripeService.getStripeCardsForCustomer(stripeCustomerId);
  },
  updateStripeCard(requestPayload: unknown): Promise<AnyuppApi.StripeCard> {
    const {
      stripeCustomerId,
      input,
    } = requestPayload as UpdateStripeCardRequest;

    missingParametersCheck(requestPayload, ['stripeCustomerId']);
    missingParametersCheck(input, ['id']);

    return stripeService.updateStripeCard(stripeCustomerId, input);
  },
  deleteStripeCard(requestPayload: unknown) {
    const {
      stripeCustomerId,
      input,
    } = requestPayload as DeleteStripeCardRequest;

    missingParametersCheck(requestPayload, ['stripeCustomerId']);
    missingParametersCheck(input, ['id']);

    return stripeService.deleteStripeCard(stripeCustomerId, input);
  },
  startStripePayment(requestPayload: unknown) {
    const {
      stripeCustomerId,
      input,
    } = requestPayload as StartStripePaymentRequest;

    missingParametersCheck(requestPayload, ['stripeCustomerId']);
    missingParametersCheck(input, [
      'chainId',
      'unitId',
      'paymentMethod',
      'userLocation',
    ]);

    return stripeService.startStripePayment(stripeCustomerId, input);
  },
};
