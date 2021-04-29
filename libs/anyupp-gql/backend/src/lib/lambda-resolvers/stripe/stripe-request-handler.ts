import { AnyuppApi } from '@bgap/anyupp-gql/api';
import { missingParametersCheck } from '@bgap/shared/utils';
import * as stripeService from './stripe.service';
import { GraphqlApiClient } from '@bgap/shared/graphql/api-client';

interface WithStripeCustomer {
  stripeCustomerId: string;
}
interface WithCognitoUser {
  userId: string;
}

type UpdateStripeCardRequest = WithStripeCustomer &
  AnyuppApi.MutationUpdateMyStripeCardArgs;
type DeleteStripeCardRequest = WithStripeCustomer &
  AnyuppApi.MutationDeleteMyStripeCardArgs;
type StartStripePaymentRequest = WithCognitoUser &
  AnyuppApi.MutationStartStripePaymentArgs;

export type ListStripeCardsRequest = WithCognitoUser;

export const stripeRequestHandler = {
  // LIST STRIPE CARDS FOR THE LOGGED IN CUSTOMER
  listStripeCards: (crudGraphqlClient: GraphqlApiClient) => (requestPayload: ListStripeCardsRequest,
  ): Promise<AnyuppApi.StripeCard[]> => {

    return stripeService.listStripeCards(crudGraphqlClient, requestPayload.userId);
  },

  startStripePayment: (crudGraphqlClient: GraphqlApiClient) => (requestPayload: StartStripePaymentRequest,
    ): Promise<AnyuppApi.StartStripePaymentOutput> => { // TODO
    const {
      userId,
      input,
    } = requestPayload as StartStripePaymentRequest;

    // missingParametersCheck(requestPayload, ['stripeCustomerId']);
    // missingParametersCheck(input, [
    //   'chainId',
    //   'unitId',
    //   'paymentMethod',
    //   'userLocation',
    // ]);

    return stripeService.startStripePayment(crudGraphqlClient, userId, input);
  },

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
  startStripePaymentOrig(requestPayload: unknown) {
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
