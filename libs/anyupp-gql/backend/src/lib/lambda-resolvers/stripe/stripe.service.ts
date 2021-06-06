import * as AnyuppApi from '@bgap/anyupp-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import Stripe from 'stripe';
import {
  createInvoiceAndConnectTransaction,
  createReceiptAndConnectTransaction,
} from './invoice-receipt.utils';
import {
  createTransaction,
  loadOrder,
  loadUnit,
  loadUser,
  updateOrderState,
} from './stripe-graphql-crud';
import { mapPaymentMethodToCard, StripeResolverDeps } from './stripe.utils';

export const listStripeCards = (userId: string) => async (
  deps: StripeResolverDeps,
): Promise<AnyuppApi.StripeCard[]> => {
  // 1. get userId
  console.log('listStripeCards().start().userId=' + userId);

  // 2. get User from DynamoDB
  const user = await loadAndConnectUserForStripe(userId)(deps);

  console.log(
    'listStripeCards().user=' + user + ', customerId=' + user?.stripeCustomerId,
  );

  if (!user || !user.stripeCustomerId) {
    throw Error(
      'User initialization failed. User must have a stripeCustomerId property!',
    );
  }

  console.log('listStripeCards.start listing payment methods from Stripe.');
  return deps.stripeClient.paymentMethods
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

// TODO: START PAYMENT INTENTION should use indempotency key https://stripe.com/docs/api/idempotent_requests?lang=node
export const startStripePayment = (
  userId: string,
  input: AnyuppApi.StartStripePaymentInput,
) => async (
  deps: StripeResolverDeps,
): Promise<AnyuppApi.StartStripePaymentOutput> => {
  console.log('startStripePayment().start()');

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

  if (paymentMethod == AnyuppApi.PaymentMethod.inapp && !paymentMethodId) {
    throw Error(
      'Payment method is missing from request when payment mode is INAPP!',
    );
  }

  // 2. Load order
  let order = await loadOrder(orderId)(deps);
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

  if (status.status != CrudApi.OrderStatus.none) {
    throw Error(
      'Order status must be OrderStatus.NONE if you want to pay the order! Current status:' +
        status +
        ', id=' +
        order.id,
    );
  }

  // 3. Load User
  const createStripeCustomer = paymentMethod == AnyuppApi.PaymentMethod.inapp;
  const user = await loadAndConnectUserForStripe(
    userId,
    createStripeCustomer,
    input.invoiceAddress,
  )(deps);
  console.log('startStripePayment().user.loaded=' + user?.id);

  if (!user) {
    throw Error(
      'User initialization failed. User not loaded (and maybe not created)!',
    );
  }

  if (
    paymentMethod == AnyuppApi.PaymentMethod.inapp &&
    !user.stripeCustomerId
  ) {
    throw Error(
      'User initialization failed. User must have a stripeCustomerId property!',
    );
  }

  // 4. Load unit
  const unit = await loadUnit(order.unitId)(deps);

  // 5. Handle INAPP payment
  if (paymentMethod == AnyuppApi.PaymentMethod.inapp) {
    if (!paymentMethodId) {
      throw Error(
        'Payment method is missing from request when payment mode is INAPP!',
      );
    }

    if (!user.stripeCustomerId) {
      throw Error(
        "User don't have a stripeCustomerId property, but it is mandatory for INAPP mayment mode!",
      );
    }

    const stripeAmount: number =
      order.sumPriceShown.currency === 'HUF'
        ? order.sumPriceShown.priceSum * 100
        : order.sumPriceShown.priceSum;

    // 6a. Create payment intent data
    const paymentIntentData: Stripe.PaymentIntentCreateParams = {
      amount: stripeAmount,
      currency: order.sumPriceShown.currency,
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
      await deps.stripeClient.paymentMethods.attach(
        input.paymentMethodId as string,
        {
          customer: user.stripeCustomerId,
        },
      );
    }

    // 7. Create payment intent
    // console.log('startStripePayment().creating payment intent.');
    const paymentIntent = await deps.stripeClient.paymentIntents.create(
      paymentIntentData,
    );
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
    const transaction = await createTransaction(createTransactionVars)(deps);
    console.log('startStripePayment().transaction.id=' + transaction?.id);

    if (!transaction) {
      throw new Error('Transaction not created');
    }

    // 9. Create invoice if requested
    if (input.invoiceAddress) {
      // Create Invoice
      await createInvoiceAndConnectTransaction(
        order.id,
        order.userId,
        transaction.id,
        input.invoiceAddress,
        CrudApi.InvoiceStatus.waiting,
      )(deps);
    }

    // 10. Update ORDER STATUS
    // console.log('startStripePayment().updateOrderState.order=' + order.id);
    order = await updateOrderState(
      order.id,
      userId,
      CrudApi.OrderStatus.none,
      transaction.id,
    )(deps);
    console.log('startStripePayment().updateOrderState.done()=' + order?.id);

    // 11. Return with client secret
    return Promise.resolve({
      clientSecret: paymentIntent.client_secret as string,
      status: paymentIntent.status,
    });
  } else {
    //
    // Handle CASH and CARD payment

    // 6. Create Transaction
    const createTransactionVars: CrudApi.CreateTransactionMutationVariables = {
      input: {
        userId: userId,
        orderId: orderId,
        currency: order.sumPriceShown.currency,
        status: CrudApi.PaymentStatus.waiting_for_payment,
        total: order.sumPriceShown.priceSum,
        type: paymentMethod,
      },
    };
    const transaction = await createTransaction(createTransactionVars)(deps);
    console.log('startCashPayment().transaction.id=' + transaction?.id);

    if (!transaction) {
      throw new Error('Transaction not created');
    }

    // 7. Create invoice or receipt
    if (input.invoiceAddress) {
      console.log('startCashPayment().invoiceAddress=' + input.invoiceAddress);
      await createInvoiceAndConnectTransaction(
        order.id,
        order.userId,
        transaction.id,
        input.invoiceAddress,
        CrudApi.InvoiceStatus.success,
      )(deps);
    } else {
      // await createReceiptAndConnectTransaction(
      //   order.id,
      //   order.userId,
      //   transaction.id,
      //   user.email,
      //   CrudApi.ReceiptStatus.success,
      // );
    }

    // 8. Update order
    order = await updateOrderState(
      order.id,
      userId,
      CrudApi.OrderStatus.none,
      transaction.id,
    )(deps);
    console.log('startCashPayment().updateOrderState.done()=' + order?.id);

    // 9. Return with success
    return Promise.resolve({
      clientSecret: '',
      status: CrudApi.PaymentStatus.waiting_for_payment,
    });
  }
};

const loadAndConnectUserForStripe = (
  userId: string,
  createStripeUser = true,
  invoiceAddress: AnyuppApi.UserInvoiceAddress | undefined | null = undefined,
) => async (deps: StripeResolverDeps) => {
  console.log(
    'loadAndConnectUserForStripe().start()=' +
      userId +
      ', createStripeUser=' +
      createStripeUser +
      ', invoiceAddress=' +
      invoiceAddress,
  );
  let user = await loadUser(userId)(deps);
  console.log('loadAndConnectUserForStripe().user.id=' + user?.id);
  console.log(
    'loadAndConnectUserForStripe().user.stripeCustomerId=' +
      user?.stripeCustomerId,
  );

  if (!user) {
    let customerId: string | undefined;

    if (createStripeUser === true) {
      console.log('loadAndConnectUserForStripe().Creating stripe customer');
      const stripeResponse: Stripe.Response<Stripe.Customer> = await deps.stripeClient.customers.create();
      console.log(
        'loadAndConnectUserForStripe().stripe.customerId=' + stripeResponse.id,
      );
      customerId = stripeResponse.id;
    }

    const createUserVars: CrudApi.CreateUserMutationVariables = {
      input: {
        id: userId,
        stripeCustomerId: customerId,
        invoiceAddress: invoiceAddress
          ? {
              city: invoiceAddress.city,
              country: invoiceAddress.country,
              postalCode: invoiceAddress.customerName,
              email: invoiceAddress.email,
              streetAddress: invoiceAddress.streetAddress,
              taxNumber: invoiceAddress.taxNumber,
              customerName: invoiceAddress.customerName,
            }
          : undefined,
      },
    };
    console.log(
      'loadAndConnectUserForStripe().create.user.data=' +
        JSON.stringify(createUserVars, undefined, 2),
    );
    user = await deps.crudSdk.CreateUser(createUserVars).toPromise(); //createUser(userId, customerId)(deps);
    console.log('loadAndConnectUserForStripe().User created=' + user?.id);
  } else {
    // USER ALREADY EXISTS...
    let customerId = user.stripeCustomerId;
    if (!user.stripeCustomerId && createStripeUser === true) {
      console.log('loadAndConnectUserForStripe().Creating stripe customer');
      const stripeResponse: Stripe.Response<Stripe.Customer> = await deps.stripeClient.customers.create();
      console.log(
        'loadAndConnectUserForStripe().stripe.customerId=' + stripeResponse.id,
      );
      customerId = stripeResponse.id;
    }
    const updateUserVars: CrudApi.UpdateUserMutationVariables = {
      input: {
        id: userId,
        stripeCustomerId: customerId,
        invoiceAddress: invoiceAddress
          ? {
              city: invoiceAddress.city,
              country: invoiceAddress.country,
              postalCode: invoiceAddress.customerName,
              email: invoiceAddress.email,
              streetAddress: invoiceAddress.streetAddress,
              taxNumber: invoiceAddress.taxNumber,
              customerName: invoiceAddress.customerName,
            }
          : undefined,
      },
    };
    console.log(
      'loadAndConnectUserForStripe().update.user.data=' +
        JSON.stringify(updateUserVars, undefined, 2),
    );
    user = await deps.crudSdk.UpdateUser(updateUserVars).toPromise(); //await updateUser(userId, customerId)(deps);
    console.log(
      'loadAndConnectUserForStripe().User stripe customer id created=' +
        user?.id,
    );
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
