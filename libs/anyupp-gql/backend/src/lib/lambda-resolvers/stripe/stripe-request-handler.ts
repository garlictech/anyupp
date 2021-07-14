// import { missingParametersCheck } from '@bgap/shared/utils';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import { createStripeCard } from './handlers/create-stripe-card';
import { deleteStripeCard } from './handlers/delete-stripe-card';
import { listStripeCards } from './handlers/list-stripe-cards';
import { startStripePayment } from './handlers/start-stripe-payment';
import { updateStripeCard } from './handlers/update-stripe-card';
import { StripeResolverDeps } from './stripe.utils';

interface WithCognitoUser {
  userId: string;
}

type StartStripePaymentRequest = WithCognitoUser &
  AnyuppApi.MutationStartStripePaymentArgs;

type CreateStripeCardRequest = WithCognitoUser &
  AnyuppApi.MutationCreateStripeCardArgs;

type DeleteStripeCardRequest = WithCognitoUser &
  AnyuppApi.MutationDeleteMyStripeCardArgs;

type UpdateStripeCardRequest = WithCognitoUser &
  AnyuppApi.MutationUpdateMyStripeCardArgs;

export type ListStripeCardsRequest = WithCognitoUser;

export const stripeRequestHandler = (deps: StripeResolverDeps) => ({
  listStripeCards: (requestPayload: ListStripeCardsRequest) =>
    listStripeCards(requestPayload.userId)(deps),

  createStripeCard: (requestPayload: CreateStripeCardRequest) =>
    createStripeCard(requestPayload.userId, requestPayload.input)(deps),

  deleteStripeCard: (requestPayload: DeleteStripeCardRequest) =>
    deleteStripeCard(requestPayload.userId, requestPayload.input)(deps),

  updateStripeCard: (requestPayload: UpdateStripeCardRequest) =>
    updateStripeCard(requestPayload.userId, requestPayload.input)(deps),

  startStripePayment: (requestPayload: StartStripePaymentRequest) =>
    startStripePayment(requestPayload.userId, requestPayload.input)(deps),
});
