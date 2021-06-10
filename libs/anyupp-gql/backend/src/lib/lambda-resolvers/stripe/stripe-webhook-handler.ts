import * as CrudApi from '@bgap/crud-gql/api';
import * as awsServerlessExpressMiddleware from 'aws-serverless-express/middleware';
import bodyParser from 'body-parser';
import express from 'express';
import Stripe from 'stripe';
import {
  loadOrder,
  loadTransactionByExternalTransactionId,
  loadUser,
  updateInvoiceState,
  updateOrderState,
  updateTransactionState,
} from './stripe-graphql-crud';
import { getCrudSdkForIAM } from '@bgap/crud-gql/api';
import { StripeResolverDeps } from './stripe.utils';
import { getAnyuppSdkForIAM } from '@bgap/anyupp-gql/api';
import { createReceiptAndConnectTransaction } from './invoice-receipt.utils';
import { createInvoice } from '../../szamlazzhu';
import * as Szamlazz from 'szamlazz.js';

export const createStripeWebhookExpressApp = (
  szamlazzClient: Szamlazz.Client,
  stripeClient: Stripe,
) => {
  // declare a new express app
  // const awsAccesskeyId = process.env.AWS_ACCESS_KEY_ID || '';
  // const awsSecretAccessKey = process.env.AWS_SECRET_ACCESS_KEY || '';
  const awsAccesskeyId = 'AKIAYIT7GMY5WQZFXOOX'; // process.env.AWS_ACCESS_KEY_ID || '';
  const awsSecretAccessKey = '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'; // process.env.AWS_SECRET_ACCESS_KEY || '';

  const deps: StripeResolverDeps = {
    crudSdk: getCrudSdkForIAM(awsAccesskeyId, awsSecretAccessKey),
    anyuppSdk: getAnyuppSdkForIAM(awsAccesskeyId, awsSecretAccessKey),
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

const handleInvoice = (transaction: CrudApi.Transaction) => async (
  deps: StripeResolverDeps,
) => {
  if (!transaction.invoice) {
    throw Error(
      'The transaction with id=' + transaction.id + " doesn't have an invoice!",
    );
  }

  const user = await loadUser(transaction.userId)(deps);
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
      language: Szamlazz.Language.Hungarian, // TODO: get the user's preferred language
    });

    const invoiceData: Szamlazz.SendRequestResponse = await deps.szamlazzClient.getInvoiceData(
      {
        invoiceId: invoice.invoiceId,
        pdf: false,
      },
    );

    let pdfUrl: string | undefined = undefined;
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
      CrudApi.InvoiceStatus.success,
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
      CrudApi.InvoiceStatus.failed,
      undefined,
      undefined,
    )(deps);
  }
};

const handleReceipt = (transaction: CrudApi.Transaction) => async (
  deps: StripeResolverDeps,
) => {
  console.debug('***** handleReceipt().transaction=' + transaction?.id);
  const user = await loadUser(transaction.userId)(deps);
  console.debug('***** handleReceipt().user loaded=' + user?.id);
  if (!user?.email) {
    console.warn("Can't create Receipt without valid email address");
    return;
  }

  const receiptData = new Szamlazz.Receipt({
    currency:
      transaction.currency === 'huf'
        ? Szamlazz.Currency.HUF
        : Szamlazz.Currency.EUR,
    paymentMethod: Szamlazz.PaymentMethod.Stripe,
    receiptNumberPrefix: 'ANYUPP',
    comment: transaction.id,
    exchangeBank: 'MKB',
    exchangeRate: 0.0,
    // callId: transaction.userId,
  });
  console.debug(
    '***** handleReceipt().receipt data created=' +
      JSON.stringify(receiptData, undefined, 2),
  );

  try {
    const receipt = await deps.szamlazzClient.issueReceipt(receiptData);
    console.debug(
      '***** handleReceipt().receipt=' + JSON.stringify(receipt, undefined, 2),
    );

    await createReceiptAndConnectTransaction(
      transaction.orderId,
      transaction.userId,
      transaction.id,
      user.email,
      CrudApi.ReceiptStatus.success,
      receipt.invoiceId,
      receipt.pdf,
    )(deps);
  } catch (e) {
    console.debug('***** handleReceipt().error=' + e);
    await createReceiptAndConnectTransaction(
      transaction.orderId,
      transaction.userId,
      transaction.id,
      user.email,
      CrudApi.ReceiptStatus.failed,
      undefined,
      undefined,
    )(deps);
  }
};

const handleSuccessTransaction = (externalTransactionId: string) => async (
  deps: StripeResolverDeps,
) => {
  console.debug('***** handleSuccessTransaction().id=' + externalTransactionId);
  const transaction: CrudApi.Transaction | null = await loadTransactionByExternalTransactionId(
    externalTransactionId,
  )(deps);
  // console.debug('***** handleSuccessTransaction().loaded.transaction=' + transaction);
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

const handleFailedTransaction = (externalTransactionId: string) => async (
  deps: StripeResolverDeps,
) => {
  console.debug('***** handleFailedTransaction().id=' + externalTransactionId);
  const transaction = await loadTransactionByExternalTransactionId(
    externalTransactionId,
  )(deps);
  if (transaction) {
    await updateTransactionState(
      transaction.id,
      CrudApi.PaymentStatus.failed,
    )(deps);
    console.debug('***** handleFailedTransaction().success()');
  }
};
