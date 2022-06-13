import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import bodyParser from 'body-parser';
import express from 'express';
import Stripe from 'stripe';
import * as Szamlazz from 'szamlazz.js';

import { getCrudSdkForIAM } from '@bgap/crud-gql/api';
import {
  InvoiceStatus,
  OrderStatus,
  PaymentStatus,
  ReceiptStatus,
  Transaction,
} from '@bgap/domain';

import { createInvoice } from '../../szamlazzhu';
import { createReceiptSzamlazzHu } from '../../szamlazzhu/receipt';
import { createReceiptAndConnectTransaction } from './invoice-receipt.utils';
import {
  loadOrder,
  loadTransactionByExternalTransactionId,
  loadUser,
  updateInvoiceState,
  updateOrderState,
  updateTransactionState,
} from './stripe-graphql-crud';
import { StripeResolverDepsUnauth } from './stripe.utils';

export const createStripeWebhookExpressApp = (
  szamlazzClient: Szamlazz.Client,
  stripeClient: Stripe,
) => {
  // declare a new express app
  const awsAccesskeyId = process.env.API_ACCESS_KEY_ID || '';
  const awsSecretAccessKey = process.env.API_SECRET_ACCESS_KEY || '';

  const deps: StripeResolverDepsUnauth = {
    crudSdk: getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey),
    szamlazzClient,
    stripeClient,
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
    // console.debug('***** Stripe webhook.start()');
    // console.debug('***** Stripe webhook.request=' + request);

    const endpointSecret = process.env.STRIPE_SIGNING_SECRET;
    // console.debug('***** Stripe webhook.stripeSigningSecret=' + endpointSecret);
    if (!endpointSecret) {
      throw Error('Stripe endpoint secret not found in lambda environment.');
    }

    const sig = request.headers['stripe-signature'];
    // console.debug('***** Stripe webhook.stripe.sig=' + sig);
    if (!sig) {
      throw Error('Stripe signature header not found in the request!');
    }

    let event: Stripe.Event;
    try {
      // console.debug('***** Stripe webhook.creating stripe event with ' + sig);
      event = stripeClient.webhooks.constructEvent(
        request.body,
        sig,
        endpointSecret,
      );
      console.debug('***** Stripe webhook.event.created=' + event['type']);
    } catch (err) {
      console.debug('***** Stripe webhook.error=' + err);
      // invalid signature
      response.status(400).end();
      return;
    }

    let intent = null;
    switch (event['type']) {
      case 'payment_intent.succeeded':
        intent = event.data.object as Stripe.PaymentIntent;
        await handleSuccessTransaction(intent.id)(deps);
        console.debug('***** Stripe webhook.Succeeded:', intent.id);
        break;
      case 'payment_intent.payment_failed':
        intent = event.data.object as Stripe.PaymentIntent;
        // let message = intent.last_payment_error || intent.last_payment_error.message;
        await handleFailedTransaction(intent.id)(deps);
        console.debug(
          '***** Stripe webhook.Failed:',
          intent.id,
          intent.last_payment_error?.message,
        );
        break;
    }

    response.sendStatus(200);
  });

  app.listen(3000, function () {
    console.debug('App started on port 3000');
  });

  return app;
};

const handleInvoice =
  (transaction: Transaction) => async (deps: StripeResolverDepsUnauth) => {
    if (!transaction.invoice) {
      throw Error(
        'The transaction with id=' +
          transaction.id +
          " doesn't have an invoice!",
      );
    }

    const user = await loadUser()({ ...deps, userId: transaction.userId });
    if (!user) {
      throw Error('The user with id=' + transaction.userId + ' is missing!');
    }

    const order = await loadOrder(transaction.orderId)(deps);
    if (!order) {
      throw Error('Order not found with id:' + transaction.orderId);
    }

    console.debug('***** handleInvoice().invoiceId=' + transaction.invoice.id);

    try {
      const invoice = await createInvoice(deps.szamlazzClient)({
        user,
        transaction,
        order,
        language: Szamlazz.Language.Hungarian,
      });

      const invoiceData: Szamlazz.SendRequestResponse =
        await deps.szamlazzClient.getInvoiceData({
          invoiceId: invoice.invoiceId,
          pdf: false,
        });

      let pdfUrl: string | undefined;
      if (invoiceData?.headers) {
        const url = (invoiceData.headers as Record<string, string | undefined>)[
          'szlahu_vevoifiokurl'
        ];
        if (url !== undefined) {
          pdfUrl = decodeURIComponent(url);
        }
      }

      await updateInvoiceState(
        transaction.invoice.id,
        InvoiceStatus.success,
        invoice.invoiceId,
        pdfUrl,
      )(deps);

      console.debug('***** handleInvoice().success()');
    } catch (err) {
      console.debug(
        '***** handleInvoice().error=' + JSON.stringify(err, undefined, 2),
      );
      await updateInvoiceState(
        transaction.invoice.id,
        InvoiceStatus.failed,
        undefined,
        undefined,
      )(deps);
    }
  };

const handleReceipt =
  (transaction: Transaction) => async (deps: StripeResolverDepsUnauth) => {
    console.debug('***** handleReceipt().transaction=' + transaction?.id);
    const user = await loadUser()({ ...deps, userId: transaction.userId });
    console.debug('***** handleReceipt().user loaded=' + user?.id);
    if (!user?.email) {
      console.warn('We will create a Receipt without valid email address!');
    }

    const order = await loadOrder(transaction.orderId)(deps);
    if (!order) {
      throw Error('Order not found with id:' + transaction.orderId);
    }

    try {
      console.debug('***** handleReceipt().creating receipt()');
      const receipt = await createReceiptSzamlazzHu(deps.szamlazzClient)({
        transaction,
        order,
        language: Szamlazz.Language.Hungarian,
        paymentMethod: Szamlazz.PaymentMethod.Stripe,
      });
      console.debug(
        '***** handleReceipt().receipt=' +
          JSON.stringify(receipt, undefined, 2),
      );

      const receiptData: Szamlazz.SendRequestResponse =
        await deps.szamlazzClient.getReceiptData({
          receiptId: receipt.receiptId,
          pdf: true,
        });
      console.debug(
        '***** handleReceipt().receipt.data=' +
          JSON.stringify(receiptData, undefined, 2),
      );

      await createReceiptAndConnectTransaction(
        transaction.orderId,
        transaction.userId,
        transaction.id,
        user?.email,
        ReceiptStatus.success,
        receipt.receiptId,
        receiptData.pdfBase64,
      )(deps);
    } catch (e) {
      console.debug('***** handleReceipt().error=' + e);
      await createReceiptAndConnectTransaction(
        transaction.orderId,
        transaction.userId,
        transaction.id,
        user?.email,
        ReceiptStatus.failed,
        undefined,
        undefined,
      )(deps);
    }
  };

const handleSuccessTransaction =
  (externalTransactionId: string) => async (deps: StripeResolverDepsUnauth) => {
    console.debug(
      '***** handleSuccessTransaction().id=' + externalTransactionId,
    );
    const transaction: Transaction | null =
      await loadTransactionByExternalTransactionId(externalTransactionId)(deps);
    // console.debug('***** handleSuccessTransaction().loaded.transaction=' + transaction);
    if (transaction) {
      await updateTransactionState(transaction.id, PaymentStatus.success)(deps);
      await updateOrderState(
        transaction.orderId,
        OrderStatus.placed,
        transaction.id,
        PaymentStatus.success,
      )({ ...deps, userId: transaction.userId });
      // console.debug('***** handleSuccessTransaction().success()');
      if (transaction.invoiceId) {
        await handleInvoice(transaction)(deps);
      } else {
        await handleReceipt(transaction)(deps);
      }
    } else {
      console.debug(
        '***** handleSuccessTransaction().Warning!!!! No transaction found with external id=' +
          externalTransactionId,
      );
    }
  };

const handleFailedTransaction =
  (externalTransactionId: string) => async (deps: StripeResolverDepsUnauth) => {
    console.debug(
      '***** handleFailedTransaction().id=' + externalTransactionId,
    );
    const transaction = await loadTransactionByExternalTransactionId(
      externalTransactionId,
    )(deps);
    if (transaction) {
      await updateTransactionState(transaction.id, PaymentStatus.failed)(deps);
      console.debug('***** handleFailedTransaction().success()');
      await updateOrderState(
        transaction.orderId,
        undefined, // Do nothing with order state if transaction failed
        transaction.id,
        PaymentStatus.failed,
      )({ ...deps, userId: transaction.userId });
    }
  };
