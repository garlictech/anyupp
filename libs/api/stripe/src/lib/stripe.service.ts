import Stripe from 'stripe';

import { AppsyncApi } from '@bgap/api/graphql/schema';
import { SharedSecrets, sharedSecretsPromise } from '@bgap/shared/secrets';
import { isOfType } from '@bgap/shared/utils';

import { mapStripeCardToCard, mapPaymentMethodToCard } from './stripe.utils';

// TODO: use stripe.customers.listSources https://stripe.com/docs/api/cards/list?lang=node
export const getStripeCardsForCustomer = async (
  stripeCustomerId: string,
): Promise<AppsyncApi.StripeCard[]> => {
  const stripe = await initStripe();

  return stripe.paymentMethods
    .list({
      customer: stripeCustomerId,
      type: 'card',
    })
    .then(paymentMethods => {
      return paymentMethods.data.map(mapPaymentMethodToCard);
    })
    .catch(handleStripeErrors);
};

export const updateStripeCard = async (
  stripeCustomerId: string,
  input: AppsyncApi.StripeCardUpdateInput,
): Promise<AppsyncApi.StripeCard> => {
  const stripe = await initStripe();

  return stripe.customers
    .updateSource(stripeCustomerId, input.id, {
      exp_month: input.exp_month || undefined,
      exp_year: input.exp_year || undefined,
      name: input.name || undefined,
    })
    .then(updatedCard => {
      if (!isOfType<Stripe.Card>(updatedCard, 'object', 'card')) {
        throw 'unknown Stripe response';
      }
      return mapStripeCardToCard(updatedCard);
    })
    .catch(handleStripeErrors);
};

export const deleteStripeCard = async (
  stripeCustomerId: string,
  input: AppsyncApi.StripeCardDeleteInput,
): Promise<boolean> => {
  const stripe = await initStripe();

  return stripe.customers
    .deleteSource(stripeCustomerId, input.id)
    .then(response => {
      if (!isOfType<Stripe.DeletedCard>(response, 'deleted')) {
        throw 'unknown Stripe response';
      }
      return response.deleted;
    })
    .catch(handleStripeErrors);
};

export const startStripePayment = async (
  stripeCustomerId: string,
  input: AppsyncApi.StartStripePaymentInput,
): Promise<AppsyncApi.StartStripePaymentOutput> => {
  // const stripe = await initStripe();

  // const { chainId, unitId, userId, paymentMethodId } = input;
  console.log('### ~ file: stripe.service.ts ~ line 71 ~ input', input);

  return Promise.resolve({ clientSecret: 'clientSecret', status: 'status' });

  // return stripe.customers
  //   .deleteSource(stripeCustomerId, input.id)
  //   .then(response => {
  //     if (!isOfType<Stripe.DeletedCard>(response, 'deleted')) {
  //       throw 'unknown Stripe response';
  //     }
  //     return response.deleted;
  //   })
  //   .catch(handleStripeErrors);
};

// TODO
const handleStripeErrors = (error: Stripe.StripeError) => {
  switch (error.type) {
    case 'StripeCardError':
      // A declined card error
      // error.message; // => e.g. "Your card's expiration year is invalid."
      break;
    case 'StripeRateLimitError':
      // Too many requests made to the API too quickly
      break;
    case 'StripeInvalidRequestError':
      // Invalid parameters were supplied to Stripe's API
      break;
    case 'StripeAPIError':
      // An error occurred internally with Stripe's API
      break;
    case 'StripeConnectionError':
      // Some kind of error occurred during the HTTPS communication
      break;
    case 'StripeAuthenticationError':
      // You probably used an incorrect API key
      break;
    case 'StripeError':
      break;
    default:
      // Handle any other types of unexpected errors
      break;
  }
  console.error(error.message, error);
  throw error;
};

// const getStripeCustomerIdForUser = ({ userId }: { userId: string }) => {
//   return Promise.resolve('cus_IvqDUayMLk5RMa');
// const userRef = this.dbService.userRef(userId);
// const user = await this.dbService.getRefValue<IUser>(userRef);

// // if (!user) {
// //     throw userIsMissingError(); // ERROR
// // }

// let stripeCustomerId = user.stripeCustomerId;

// if (!stripeCustomerId) {
//   stripeCustomerId = await this.creatStripeCustomer();
//   userRef.update({ stripeCustomerId });
// }

// return stripeCustomerId;
// };

// START PAYMENT INTENTION should use indempotency key https://stripe.com/docs/api/idempotent_requests?lang=node

const initStripe = async () => {
  const secrets: SharedSecrets = await sharedSecretsPromise;
  return new Stripe(secrets.stripeSecretKey, {
    apiVersion: '2020-08-27',
  });
};
