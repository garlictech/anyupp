import * as AnyuppApi from '@bgap/anyupp-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import { EOrderStatus } from '@bgap/shared/types';
import Stripe from 'stripe';
import { calculateOrderSumPrice } from '../order/order.utils';
import {
  createTransaction,
  createUser,
  loadOrder,
  loadUnit,
  loadUser,
  updateOrderState,
  updateUser,
} from './stripe-graphql-crud';
import { mapPaymentMethodToCard, StripeResolverDeps } from './stripe.utils';

export const listStripeCards = (userId: string) => async (
  deps: StripeResolverDeps,
): Promise<AnyuppApi.StripeCard[]> => {
  // 1. get userId
  console.log('listStripeCards().start().userId=' + userId);
  const stripe = await initStripe();

  // 2. get User from DynamoDB
  const user = await loadAndConnectUserForStripe(stripe, userId)(deps);

  console.log(
    'listStripeCards().user=' + user + ', customerId=' + user?.stripeCustomerId,
  );

  if (!user || !user.stripeCustomerId) {
    throw Error(
      'User initialization failed. User must have a stripeCustomerId property!',
    );
  }

  console.log('listStripeCards.start listing payment methods from Stripe.');
  return stripe.paymentMethods
    .list({
      customer: user.stripeCustomerId,
      type: 'card',
    })
    .then(paymentMethods => {
      const cards = paymentMethods.data.map(mapPaymentMethodToCard);
      console.log('listStripeCards.cards=' + JSON.stringify(cards, null, 2));
      return cards;
    })
    .catch(handleStripeErrors);
};

export const startStripePayment = (
  userId: string,
  input: AnyuppApi.StartStripePaymentInput,
) => async (
  deps: StripeResolverDeps,
): Promise<AnyuppApi.StartStripePaymentOutput> => {
  console.log('startStripePayment().start()');
  const stripe = await initStripe();

  // 1. Get parameters, orderId and payment method
  const { orderId, paymentMethod, paymentMethodId, savePaymentMethod } = input;
  console.log(
    'startStripePayment().orderId=' +
      orderId +
      ', paymentMethod=' +
      paymentMethod +
      ', paymentMethodId=' +
      paymentMethodId +
      ', saveCard=' +
      savePaymentMethod,
  );

  if (!paymentMethodId) {
    throw Error('Payment method is missing from request!');
  }

  // 2. Load order
  const order = await loadOrder(orderId)(deps).toPromise();
  console.log('startStripePayment().order.loaded=' + order?.id);

  if (order == null) {
    throw Error('Order not found with id=' + orderId);
  }

  if (userId !== order.userId) {
    throw Error(
      "The Order must belongs to the user, the Order's userId field is not match with the logined User's id! Details: order.userId=" +
        order.userId +
        ' vs userId=' +
        userId,
    );
  }

  const status = order.statusLog[order.statusLog.length - 1];

  if (status.status != EOrderStatus.NONE) {
    throw Error(
      'Order status must be OrderStatus.NONE if you want to pay the order! Current status:' +
        status +
        ', id=' +
        order.id,
    );
  }

  // 3. Load User
  const user = await loadAndConnectUserForStripe(stripe, userId)(deps);
  console.log('startStripePayment().user.loaded=' + user?.id);
  if (!user || !user.stripeCustomerId) {
    throw Error(
      'User initialization failed. User must have a stripeCustomerId property!',
    );
  }

  // 4. Load unit
  const unit = await loadUnit(order.unitId)(deps).toPromise();

  // 5. Calculate summary
  const price = calculateOrderSumPrice(order.items || []);
  console.log(
    'startStripePayment().calculate.price=' +
      price?.priceSum +
      ' ' +
      price?.currency,
  );

  // 6a. Create payment intent data
  const paymentIntentData: Stripe.PaymentIntentCreateParams = {
    amount: price.priceSum * 100,
    currency: price.currency,
    payment_method: paymentMethodId,
    payment_method_types: ['card'],
    customer: user.stripeCustomerId,
  };

  // 6b. Add optional merchantId to the payment
  if (unit?.merchantId) {
    console.log('startStripePayment().set merchantId=' + unit.merchantId);
    paymentIntentData.application_fee_amount = 0;
    paymentIntentData.transfer_data = {
      destination: unit.merchantId,
    };
  }

  // 6c. Save card for later use
  if (savePaymentMethod === true) {
    await stripe.paymentMethods.attach(input.paymentMethodId as string, {
      customer: user.stripeCustomerId,
    });
  }

  // 7. Create payment intent
  // console.log('startStripePayment().creating payment intent.');
  const paymentIntent = await stripe.paymentIntents.create(paymentIntentData);
  console.log(
    'startStripePayment().payment intent created=' + paymentIntent.id,
  );

  // 8. Create Transaction
  const createTransactionVars: CrudApi.CreateTransactionMutationVariables = {
    input: {
      userId: userId,
      orderId: orderId,
      currency: order.sumPriceShown.currency,
      status: CrudApi.PaymentStatus.waiting_for_payment,
      externalTransactionId: paymentIntent.id,
      total: order.sumPriceShown.priceSum,
      type: 'STRIPE',
    },
  };
  const transaction = await createTransaction(
    crudGraphqlClient,
    createTransactionVars,
  );
  console.log('startStripePayment().transaction.id=' + transaction.id);

  // 9. Update ORDER STATUS
  // console.log('startStripePayment().updateOrderState.order=' + order.id);
  order = await updateOrderState(
    crudGraphqlClient,
    order.id,
    userId,
    CrudApi.OrderStatus.NONE,
    transaction.id,
  );
  console.log('startStripePayment().updateOrderState.done()=' + order?.id);

  console.log('startStripePayment().transaction=' + transaction?.id);

  // 6. Return with client secret
  return Promise.resolve({
    clientSecret: paymentIntent.client_secret as string,
    status: paymentIntent.status,
  });
};

const loadAndConnectUserForStripe = (stripe: Stripe, userId: string) => async (
  deps: StripeResolverDeps,
) => {
  console.log('loadAndConnectUserForStripe().start()=' + userId);
  let user = await loadUser(userId)(deps).toPromise();
  console.log('loadAndConnectUserForStripe().user=' + user);

  if (!user || !user.stripeCustomerId) {
    const stripeResponse: Stripe.Response<Stripe.Customer> = await stripe.customers.create();
    console.log(
      'loadAndConnectUserForStripe().stripe.statusCode=' +
        stripeResponse.lastResponse?.statusCode,
    );
    console.log(
      'loadAndConnectUserForStripe().stripe.customerId=' + stripeResponse.id,
    );

    if (!user) {
      // console.log('loadAndConnectUserForStripe().creating user.')
      user = await createUser(crudGraphqlClient, userId, stripeResponse.id);
      console.log('loadAndConnectUserForStripe().User created=' + user.id);
    } else if (!user.stripeCustomerId) {
      // console.log('loadAndConnectUserForStripe().Connecting stripe Customer to User. customer=' + stripeResponse.id);
      user = await updateUser(crudGraphqlClient, userId, stripeResponse.id);
      console.log(
        'loadAndConnectUserForStripe().User stripe customer id created=' +
          user.id,
      );
    }
  }

  return user;
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

// START PAYMENT INTENTION should use indempotency key https://stripe.com/docs/api/idempotent_requests?lang=node
export const initStripe = async () => {
  const secret = process.env.STRIPE_SECRET_KEY;
  // console.log('initStripe.secret()=' + secret);
  if (!secret) {
    throw Error(
      'Stripe secret key not found in lambda environment. Add itt with the name STRIPE_SECRET_KEY',
    );
  }
  return new Stripe(secret, {
    apiVersion: '2020-08-27',
  });
};
