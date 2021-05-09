import { CrudApi } from '@bgap/crud-gql/api';
import { crudBackendGraphQLClient, GraphqlApiClient } from '@bgap/shared/graphql/api-client';
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import bodyParser from 'body-parser';
import express from 'express';
import Stripe from 'stripe';
import { loadTransaction, updateOrderState, updateTransactionState } from './stripe-graphql-crud';
import { initStripe } from './stripe.service';

export const createStripeWebhookExpressApp = () => {

  // declare a new express app
  const app = express()

  // app.use(bodyParser.json())
  app.use(awsServerlessExpressMiddleware.eventContext())

  // Enable CORS for all methods
  app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*")
    res.header("Access-Control-Allow-Headers", "*")
    next()
  });

  app.use(bodyParser.json({
    verify: (req, res, buf) => {
      (req as any).rawBody = buf.toString()
    }
  }));


  app.post('/webhook', async function (request, response) {

    console.log('***** Stripe webhook.start()');
    const stripe = await initStripe();
    console.log('***** Stripe webhook. Stripe initialized()');

    const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
    // console.log('***** Stripe webhook.stripeSigningSecret=' + endpointSecret);
    if (!endpointSecret) {
      throw Error('Stripe endpoint secret not found in lambda environment.');
    }

    const sig = request.headers['stripe-signature'];
    console.log('***** Stripe webhook.stripe.sig=' + sig);
    if (!sig) {
      throw Error('Stripe signature header not found in the request!');
    }


    // console.log('***** Stripe webhook.request=' + request);
    let event: Stripe.Event;
    try {
      event = stripe.webhooks.constructEvent((request as any).rawBody, sig, endpointSecret);
      console.log('***** Stripe webhook.event=' + event['type']);
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
        handleSuccessTransaction(crudBackendGraphQLClient, intent.id);
        console.log("***** Stripe webhook.Succeeded:", intent.id);
        break;
      case 'payment_intent.payment_failed':
        intent = event.data.object as Stripe.PaymentIntent;
        // let message = intent.last_payment_error || intent.last_payment_error.message;
        console.log('***** Stripe webhook.Failed:', intent.id, intent.last_payment_error?.message);
        handleFailedTransaction(crudBackendGraphQLClient, intent.id);
        break;
    }

    response.sendStatus(200);
  });

  app.listen(3000, function () {
    console.log("App started on port 3000")
  });

  return app;
};

const handleSuccessTransaction = async (crudGraphqlClient: GraphqlApiClient, transactionId: string) => {
  console.log('***** handleSuccessTransaction()');
  const transaction = await loadTransaction(crudGraphqlClient, transactionId);
  if (transaction) {
    await updateTransactionState(crudGraphqlClient, transaction.id, CrudApi.PaymentStatus.SUCCESS);
    await updateOrderState(crudGraphqlClient, transaction.orderId, transaction.userId, CrudApi.OrderStatus.PLACED);
    console.log('***** handleSuccessTransaction().success()');
  }

}

const handleFailedTransaction = async (crudGraphqlClient: GraphqlApiClient, transactionId: string) => {

  console.log('***** handleFailedTransaction()');
  const transaction = await loadTransaction(crudGraphqlClient, transactionId);
  if (transaction) {
    await updateTransactionState(crudGraphqlClient, transaction.id, CrudApi.PaymentStatus.FAILED);
    console.log('***** handleFailedTransaction().success()');
  }
}

// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
// module.exports = app
