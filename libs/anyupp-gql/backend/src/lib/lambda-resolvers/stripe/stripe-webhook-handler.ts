import * as CrudApi from '@bgap/crud-gql/api';
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import bodyParser from 'body-parser';
import express from 'express';
import Stripe from 'stripe';
import {
  loadInvoice,
  loadOrder,
  loadTransactionByExternalTransactionId,
  loadUnit,
  loadUser,
  updateOrderState,
  updateTransactionState,
} from './stripe-graphql-crud';
import { initStripe } from './stripe.service';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';
import { StripeResolverDeps } from './stripe.utils';
import { getAnyuppSdkForIAM } from '@bgap/anyupp-gql/api';

export const createStripeWebhookExpressApp = () => {
  // declare a new express app
  // const awsAccesskeyId = process.env.AWS_ACCESS_KEY_ID || '';
  // const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
  const awsAccesskeyId = 'AKIAYIT7GMY5WQZFXOOX'; // process.env.AWS_ACCESS_KEY_ID || '';
  const awsSecretAccessKey = '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'; // process.env.AWS_SECRET_ACCESS_KEY || '';

  const deps: StripeResolverDeps = {
    crudSdk: getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey),
    anyuppSdk: getAnyuppSdkForIAM(awsAccesskeyId, awsSecretAccessKey),
  };
  const app = express();

  //app.use(bodyParser.json())
  app.use(awsServerlessExpressMiddleware.eventContext());

  // Enable CORS for all methods
  app.use(function (_req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', '*');
    next();
  });

  app.use('/webhook', bodyParser.raw({ type: '*/*' }));
  app.post('/webhook', async function (request, response) {
    console.log('***** Stripe webhook.start()');
    // console.log('***** Stripe webhook.request=' + request);
    const stripe = await initStripe();
    // console.log('***** Stripe webhook. Stripe initialized()');

    const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
    // console.log('***** Stripe webhook.stripeSigningSecret=' + endpointSecret);
    if (!endpointSecret) {
      throw Error('Stripe endpoint secret not found in lambda environment.');
    }

    const sig = request.headers['stripe-signature'];
    // console.log('***** Stripe webhook.stripe.sig=' + sig);
    if (!sig) {
      throw Error('Stripe signature header not found in the request!');
    }

    let event: Stripe.Event;
    try {
      // console.log('***** Stripe webhook.creating stripe event with ' + sig);
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
      console.log('***** Stripe webhook.event.created=' + event['type']);
    } catch (err) {
      console.log('***** Stripe webhook.error=' + err);
      // invalid signature
      response.status(400).end();
      return;
    }

    let intent = null;
    switch (event['type']) {
      case 'payment_intent.succeeded':
        intent = event.data.object as Stripe.PaymentIntent;
        await handleSuccessTransaction(intent.id)(deps);
        console.log('***** Stripe webhook.Succeeded:', intent.id);
        break;
      case 'payment_intent.payment_failed':
        intent = event.data.object as Stripe.PaymentIntent;
        // let message = intent.last_payment_error || intent.last_payment_error.message;
        await handleFailedTransaction(intent.id)(deps);
        console.log(
          '***** Stripe webhook.Failed:',
          intent.id,
          intent.last_payment_error?.message,
        );
        break;
    }

    response.sendStatus(200);
  });

  app.listen(3000, function () {
    console.log('App started on port 3000');
  });

  return app;
};

const handleInvoice = (orderId: string) => async (deps: StripeResolverDeps) => {
  const order = await loadOrder(orderId)(deps);
  if (!order) {
    throw Error('Order not found with id=' + orderId);
  }

  if (!order.transaction) {
    throw Error(
      'The order with id=' + orderId + " doesn't have a transaction!",
    );
  }

  if (!order.transaction.invoice) {
    throw Error('The order with id=' + orderId + " doesn't have an invoice!");
  }

  const unit = await loadUnit(order.unitId)(deps);
  const user = await loadUser(order.userId)(deps);

  console.log('handleInvoice().invoiceId=' + order.transaction.invoice.id);

  // TODO IDE KELL A SZAMLAZZ.HU HIVAS
  // TODO osszes szamla info benne van az Order-ben?
  // 1. Transaction
  // 2. Invoice
  // 3. OrderItems
  // 4. Unit? - nincs, be kell tolteni
  // 5. User? - nincs, be kell tolteni
};

const handleSuccessTransaction = (externalTransactionId: string) => async (
  deps: StripeResolverDeps,
) => {
  console.log('***** handleSuccessTransaction().id=' + externalTransactionId);
  const transaction = await loadTransactionByExternalTransactionId(
    externalTransactionId,
  )(deps);
  // console.log('***** handleSuccessTransaction().loaded.transaction=' + transaction);
  if (transaction) {
    await updateTransactionState(
      transaction.id,
      CrudApi.PaymentStatus.success,
    )(deps);
    await updateOrderState(
      transaction.orderId,
      transaction.userId,
      CrudApi.OrderStatus.placed,
      transaction.id,
    )(deps);
    // console.log('***** handleSuccessTransaction().success()');
    await handleInvoice(transaction.orderId)(deps);
  } else {
    console.log(
      '***** handleSuccessTransaction().Warning!!!! No transaction found with external id=' +
        externalTransactionId,
    );
  }
};

const handleFailedTransaction = (externalTransactionId: string) => async (
  deps: StripeResolverDeps,
) => {
  console.log('***** handleFailedTransaction().id=' + externalTransactionId);
  const transaction = await loadTransactionByExternalTransactionId(
    externalTransactionId,
  )(deps);
  if (transaction) {
    await updateTransactionState(
      transaction.id,
      CrudApi.PaymentStatus.failed,
    )(deps);
    console.log('***** handleFailedTransaction().success()');
  }
};
