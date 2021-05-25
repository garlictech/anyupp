// import { missingParametersCheck } from '@bgap/shared/utils';
import * as stripeService from './stripe.service';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { StripeResolverDeps } from './stripe.utils';

// interface WithStripeCustomer {
//   stripeCustomerId: string;
// }
interface WithCognitoUser {
  userId: string;
}

// type UpdateStripeCardRequest = WithStripeCustomer &
//   AnyuppApi.MutationUpdateMyStripeCardArgs;
// type DeleteStripeCardRequest = WithStripeCustomer &
//   AnyuppApi.MutationDeleteMyStripeCardArgs;
type StartStripePaymentRequest = WithCognitoUser &
  AnyuppApi.MutationStartStripePaymentArgs;

export type ListStripeCardsRequest = WithCognitoUser;

export const stripeRequestHandler = (deps: StripeResolverDeps) => ({
  // LIST STRIPE CARDS FOR THE LOGGED IN CUSTOMER
  listStripeCards: (requestPayload: ListStripeCardsRequest) =>
    stripeService.listStripeCards(requestPayload.userId)(deps),

  startStripePayment: (requestPayload: StartStripePaymentRequest) => {
    const { userId, input } = requestPayload as StartStripePaymentRequest;

    return stripeService.startStripePayment(userId, input)(deps);
  },

  // getStripeCardsForCustomer(
  //   requestPayload: unknown,
  // ): Promise<AnyuppApi.StripeCard[]> {
  //   const { stripeCustomerId } = requestPayload as WithStripeCustomer;

  //   if (!stripeCustomerId) {
  //     return Promise.resolve([]);
  //   }

  //   return stripeService.getStripeCardsForCustomer(stripeCustomerId);
  // },
  // updateStripeCard(requestPayload: unknown): Promise<AnyuppApi.StripeCard> {
  //   const {
  //     stripeCustomerId,
  //     input,
  //   } = requestPayload as UpdateStripeCardRequest;

  //   missingParametersCheck(requestPayload, ['stripeCustomerId']);
  //   missingParametersCheck(input, ['id']);

  //   return stripeService.updateStripeCard(stripeCustomerId, input);
  // },
  // deleteStripeCard(requestPayload: unknown) {
  //   const {
  //     stripeCustomerId,
  //     input,
  //   } = requestPayload as DeleteStripeCardRequest;

  //   missingParametersCheck(requestPayload, ['stripeCustomerId']);
  //   missingParametersCheck(input, ['id']);

  //   return stripeService.deleteStripeCard(stripeCustomerId, input);
  // },
  // startStripePaymentOrig(requestPayload: unknown) {
  //   const {
  //     stripeCustomerId,
  //     input,
  //   } = requestPayload as StartStripePaymentRequest;

  //   missingParametersCheck(requestPayload, ['stripeCustomerId']);
  //   missingParametersCheck(input, [
  //     'chainId',
  //     'unitId',
  //     'paymentMethod',
  //     'userLocation',
  //   ]);

  //   return stripeService.startStripePayment(stripeCustomerId, input);
  // },
});
