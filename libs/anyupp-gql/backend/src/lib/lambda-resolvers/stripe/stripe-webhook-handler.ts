import express from 'express';
import bodyParser from 'body-parser';
// import { awsServerlessExpressMiddleware }  from 'aws-serverless-express/middleware';
import { initStripe } from './stripe.service';
import Stripe from 'stripe';
// import awsServerlessExpress from 'aws-serverless-express';
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware'

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
    console.log('***** Stripe webhook.stripeSigningSecret=' + endpointSecret);
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
      console.log('***** Stripe webhook.event=' + JSON.stringify(event, null, 2));
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
        console.log("Succeeded:", intent.id);
        break;
      case 'payment_intent.payment_failed':
        intent = event.data.object as Stripe.PaymentIntent;
        // let message = intent.last_payment_error || intent.last_payment_error.message;
        console.log('Failed:', intent.id, intent.last_payment_error?.message);
        break;
    }

    response.sendStatus(200);
  });

  app.listen(3000, function () {
    console.log("App started on port 3000")
  });

  return app;
};



// Export the app object. When executing the application local this does nothing. However,
// to port it to AWS Lambda we will create a wrapper around that will load the app from
// this file
// module.exports = app
