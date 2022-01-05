import * as CrudApi from '@bgap/crud-gql/api';
import { createStripeCard } from './handlers/create-stripe-card';
import { deleteStripeCard } from './handlers/delete-stripe-card';
import { listStripeCards } from './handlers/list-stripe-cards';
import { payTipWithStripe } from './handlers/pay-tip-with-stripe';
import { startStripePayment } from './handlers/start-stripe-payment';
import { updateStripeCard } from './handlers/update-stripe-card';
import { StripeResolverDeps } from './stripe.utils';

interface WithCognitoUser {
  userId: string;
}

type StartStripePaymentRequest = WithCognitoUser &
  CrudApi.MutationStartStripePaymentArgs;

type PayTipWithStripeRequest = WithCognitoUser &
  CrudApi.MutationPayTipWithStripeArgs;

type CreateStripeCardRequest = WithCognitoUser &
  CrudApi.MutationCreateStripeCardArgs;

type DeleteStripeCardRequest = WithCognitoUser &
  CrudApi.MutationDeleteMyStripeCardArgs;

type UpdateStripeCardRequest = WithCognitoUser &
  CrudApi.MutationUpdateMyStripeCardArgs;

export type ListStripeCardsRequest = WithCognitoUser;

export const stripeRequestHandler = (deps: StripeResolverDeps) => ({
  listStripeCards: () => listStripeCards()(deps),

  createStripeCard: (requestPayload: CreateStripeCardRequest) =>
    createStripeCard(requestPayload.input)(deps),

  deleteStripeCard: (requestPayload: DeleteStripeCardRequest) =>
    deleteStripeCard(requestPayload.input)(deps),

  updateStripeCard: (requestPayload: UpdateStripeCardRequest) =>
    updateStripeCard(requestPayload.input)(deps),

  startStripePayment: (requestPayload: StartStripePaymentRequest) =>
    startStripePayment(requestPayload.input)(deps),

  payTipWithStripe: (requestPayload: PayTipWithStripeRequest) =>
    payTipWithStripe(requestPayload.input)(deps),
});
