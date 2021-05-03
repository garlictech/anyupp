import Stripe from 'stripe';

import { AnyuppApi } from '@bgap/anyupp-gql/api';

import { mapPaymentMethodToCard } from './stripe.utils';
import { executeMutation, GraphqlApiClient } from '@bgap/shared/graphql/api-client';
import { CrudApi, CrudApiMutationDocuments } from '@bgap/crud-gql/api';
import { map } from 'rxjs/operators';
import { EOrderStatus, IOrder, IStatusLog, IUnit, IUser } from '@bgap/shared/types';
import { calculateOrderSumPrice } from '../order/order.utils';
import { loadOrder, loadUnit, loadUser } from './stripe-graphql-crud';

export const listStripeCards = async (
  crudGraphqlClient: GraphqlApiClient,
  userId: string,
): Promise<AnyuppApi.StripeCard[]> => {

  // 1. get userId
  console.log('listStripeCards().start().userId=' + userId);
  const stripe = await initStripe();

  // 2. get User from DynamoDB
  let user: IUser = await loadUser(crudGraphqlClient, userId);
  console.log('listStripeCards().user=' + user);

  if (!user || !user.stripeCustomerId) {

    const stripeResponse: Stripe.Response<Stripe.Customer> = await stripe.customers.create();
    console.log('listStripeCards().stripe.statusCode=' + stripeResponse.lastResponse?.statusCode);
    console.log('listStripeCards().stripe.customerId=' + stripeResponse.id);

    if (!user) {
      console.log('listStripeCards().creating user.')
      const createUserVars: CrudApi.CreateUserMutationVariables = {
        input: {
          stripeCustomerId: stripeResponse.id,
          id: userId,
        },
      };

      user = await executeMutation(crudGraphqlClient)<CrudApi.CreateUserMutation>(
        CrudApiMutationDocuments.createUser,
        createUserVars,
      ).pipe(
        map(data => data.createUser as IUser),
      ).toPromise();
      console.log('listStripeCards().User created=' + user.id);
    } else

      if (!user.stripeCustomerId) {
        console.log('listStripeCards().Connecting stripe Customer to User. customer=' + stripeResponse.id);
        const updateUserVars: CrudApi.UpdateUserMutationVariables = {
          input: {
            stripeCustomerId: stripeResponse.id,
            id: userId,
          },
        };

        user = await executeMutation(crudGraphqlClient)<CrudApi.UpdateUserMutation>(
          CrudApiMutationDocuments.updateUser,
          updateUserVars
        ).pipe(
          map(data => data.updateUser as IUser),
        ).toPromise();
        console.log('listStripeCards().User stripe customer id created=' + user.id);
      }
  }
  // User already have a record in the User table and has a stripeCustomerId
  if (!user.stripeCustomerId) {
    console.error('listStripeCards.error: The Stripe customer Id of the user can\'t be empty!');
    throw Error('Error. The Stripe customer Id of the user can\'t be empty!');
  }

  console.log('listStripeCards.start listing payment methods from Stripe.')
  return stripe.paymentMethods
    .list({
      customer: user.stripeCustomerId,
      type: 'card',
    })
    .then(paymentMethods => {
      return paymentMethods.data.map(mapPaymentMethodToCard);
    })
    .catch(handleStripeErrors);
}

// = async (
//   crudGraphqlClient: GraphqlApiClient,
//   requestPayload: ListStripeCardsRequest,
// ):

export const startStripePayment = async (
  crudGraphqlClient: GraphqlApiClient,
  userId: string,
  input: AnyuppApi.StartStripePaymentInput,
): Promise<AnyuppApi.StartStripePaymentOutput> => {

  console.log('startStripePayment().start()');
  const stripe = await initStripe();

  // 1. Get parameters, orderId and payment method
  const { orderId, paymentMethod, paymentMethodId, savePaymentMethod } = input;
  console.log('startStripePayment().orderId=' + orderId +
    ', paymentMethod=' + paymentMethod +
    ', paymentMethodId=' + paymentMethodId +
    ', saveCard=' + savePaymentMethod);

  if (!paymentMethodId) {
    throw Error('Payment method is missing from request!');
  }

  // 2. Load order
  const order: IOrder = await loadOrder(crudGraphqlClient, orderId);
  console.log('startStripePayment().order.loaded=' + order?.id);

  if (userId !== order.userId) {
    throw Error('The Order must belongs to the user, the Order\'s userId field is not match with the logined User\'s id! Details: order.userId=' + order.userId + ' vs userId=' + userId);
  }

  // 3. Load User
  const user: IUser = await loadUser(crudGraphqlClient, userId);
  console.log('startStripePayment().user.loaded=' + user?.id);

  // 4. Load unit
  const unit: IUnit = await loadUnit(crudGraphqlClient, order.unitId);

  // 5. Calculate summary
  const price = calculateOrderSumPrice(order.items);
  console.log('startStripePayment().calculate.price=' + price?.priceSum + ' ' + price?.currency);

  // 6a. Create payment intent data
  const paymentIntentData: Stripe.PaymentIntentCreateParams = {
    amount: price.priceSum * 100,
    currency: price.currency,
    payment_method: paymentMethodId,
    payment_method_types: ['card'],
    customer: user.stripeCustomerId
  }

  // 6b. Add optional merchantId to the payment
  if (unit.merchantId) {
    paymentIntentData.application_fee_amount = 0;
    paymentIntentData.transfer_data = {
      destination: unit.merchantId
    };
  }

  // 5. Create payment intent
  const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);

  // 4. Change ORDER STATUS????
  const log: IStatusLog =  order.statusLog;
  log[Date.now()] = {
    userId: userId,
    status: EOrderStatus.PAID,  // TODO nem Paid lesz
    ts: Date.now(),
  };

  // 5. Create Transaction??
  // executeMutation(crudGraphqlClient)<CrudApi.CreateTransactionMutation>(

  // );


  // 6. Return with client secret
  return Promise.resolve({
    clientSecret: paymentIntent.client_secret as string,
    status: paymentIntent.status
  });
};



// TODO: use stripe.customers.listSources https://stripe.com/docs/api/cards/list?lang=node
// export const getStripeCardsForCustomer = async (
//   stripeCustomerId: string,
// ): Promise<AnyuppApi.StripeCard[]> => {
//   const stripe = await initStripe();

//   return stripe.paymentMethods
//     .list({
//       customer: stripeCustomerId,
//       type: 'card',
//     })
//     .then(paymentMethods => {
//       return paymentMethods.data.map(mapPaymentMethodToCard);
//     })
//     .catch(handleStripeErrors);
// };

// export const updateStripeCard = async (
//   stripeCustomerId: string,
//   input: AnyuppApi.StripeCardUpdateInput,
// ): Promise<AnyuppApi.StripeCard> => {
//   const stripe = await initStripe();

//   return stripe.customers
//     .updateSource(stripeCustomerId, input.id, {
//       exp_month: input.exp_month || undefined,
//       exp_year: input.exp_year || undefined,
//       name: input.name || undefined,
//     })
//     .then(updatedCard => {
//       if (!isOfType<Stripe.Card>(updatedCard, 'object', 'card')) {
//         throw 'unknown Stripe response';
//       }
//       return mapStripeCardToCard(updatedCard);
//     })
//     .catch(handleStripeErrors);
// };

// export const deleteStripeCard = async (
//   stripeCustomerId: string,
//   input: AnyuppApi.StripeCardDeleteInput,
// ): Promise<boolean> => {
//   const stripe = await initStripe();

//   return stripe.customers
//     .deleteSource(stripeCustomerId, input.id)
//     .then(response => {
//       if (!isOfType<Stripe.DeletedCard>(response, 'deleted')) {
//         throw 'unknown Stripe response';
//       }
//       return response.deleted;
//     })
//     .catch(handleStripeErrors);
// };

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

export const initStripe = async () => {
  const secret = process.env.STRIPE_SECRET_KEY;
  console.log('initStripe.secret()=' + secret);
  if (!secret) {
    throw Error('Stripe secret key not found in lambda environment. Add itt with the name STRIPE_SECRET_KEY');
  }
  return new Stripe(secret, {
    apiVersion: '2020-08-27',
  });
};
