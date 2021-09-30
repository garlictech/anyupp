import * as CrudApi from '@bgap/crud-gql/api';
import Stripe from 'stripe';
import {
  createTransaction,
  loadOrder,
  loadUnit,
  updateOrderState,
} from '../stripe-graphql-crud';
import { StripeResolverDeps } from '../stripe.utils';
import { loadAndConnectUserForStripe } from './common-stripe';
import { toFixed0Number } from '@bgap/shared/utils';
import { createInvoiceAndConnectTransaction } from '../invoice-receipt.utils';

// START PAYMENT INTENTION should use indempotency key https://stripe.com/docs/api/idempotent_requests?lang=node (Covered by #804)
export const startStripePayment =
  (userId: string, input: CrudApi.StartStripePaymentInput) =>
  async (
    deps: StripeResolverDeps,
  ): Promise<CrudApi.StartStripePaymentOutput> => {
    console.debug('startStripePayment().start()');

    // 1. Get parameters, orderId and payment method
    const {
      orderId,
      paymentMethod,
      paymentMethodId,
      savePaymentMethod,
      invoiceAddress,
    } = input;
    console.debug(
      'startStripePayment().orderId=' +
        orderId +
        ', paymentMethod=' +
        paymentMethod +
        ', paymentMethodId=' +
        paymentMethodId +
        ', saveCard=' +
        savePaymentMethod,
    );

    if (paymentMethod == CrudApi.PaymentMethod.inapp && !paymentMethodId) {
      throw Error(
        'Payment method is missing from request when payment mode is INAPP!',
      );
    }
    console.debug('startStripePayment().invoiceAddress=' + invoiceAddress);

    // 2. Load order
    let order = await loadOrder(orderId)(deps);
    console.debug('startStripePayment().order.loaded=' + order?.id);

    if (!order) {
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
    const createStripeCustomer = paymentMethod == CrudApi.PaymentMethod.inapp;
    const user = await loadAndConnectUserForStripe(
      userId,
      createStripeCustomer,
      input.invoiceAddress,
    )(deps);
    console.debug('startStripePayment().user.loaded=' + user?.id);

    if (!user) {
      throw Error(
        'User initialization failed. User not loaded (and maybe not created)!',
      );
    }

    if (
      paymentMethod == CrudApi.PaymentMethod.inapp &&
      !user.stripeCustomerId
    ) {
      throw Error(
        'User initialization failed. User must have a stripeCustomerId property!',
      );
    }

    // 4. Load unit
    console.debug('startStripePayment().loading unit()=' + order.unitId);
    const unit = await loadUnit(order.unitId)(deps);
    console.debug('startStripePayment().unit().loaded=' + unit?.id);
    if (!unit) {
      throw Error('Unit not found with id=' + order.unitId);
    }

    // 5. Handle INAPP payment
    if (paymentMethod == CrudApi.PaymentMethod.inapp) {
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
          ? toFixed0Number(order.sumPriceShown.priceSum * 100)
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
        console.debug('startStripePayment().set merchantId=' + unit.merchantId);
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
      // console.debug('startStripePayment().creating payment intent.');
      const paymentIntent = await deps.stripeClient.paymentIntents.create(
        paymentIntentData,
      );
      console.debug(
        'startStripePayment().payment intent created=' + paymentIntent.id,
      );

      // 8. Create Transaction
      const createTransactionVars: CrudApi.CreateTransactionMutationVariables =
        {
          input: {
            userId: userId,
            orderId: orderId,
            currency: order.sumPriceShown.currency,
            status: CrudApi.PaymentStatus.waiting_for_payment, // shouldn't we use statusLog instead of the simple actual status ? (Covered by #945)
            externalTransactionId: paymentIntent.id,
            total: order.sumPriceShown.priceSum,
            type: 'stripe',
          },
        };
      const transaction = await createTransaction(createTransactionVars)(deps);
      console.debug('startStripePayment().transaction.id=' + transaction?.id);

      if (!transaction) {
        throw new Error('Transaction not created');
      }

      // 9. Create invoice if requested
      if (invoiceAddress) {
        console.debug(
          'startStripePayment().createInvoiceAndConnectTransaction()=' +
            invoiceAddress,
        );
        // Create Invoice
        await createInvoiceAndConnectTransaction(
          order.id,
          order.userId,
          transaction.id,
          invoiceAddress,
          CrudApi.InvoiceStatus.waiting,
        )(deps);
      }

      // 10. Update ORDER STATUS
      order = await updateOrderState(
        order.id,
        userId,
        undefined, // use undefined to prevend graphql api to override this field
        transaction.id,
        // it should be undefined because we don't want to overwrite the field with GraphQL API.
        transaction.status ? transaction.status : undefined,
      )(deps);
      console.debug(
        'startStripePayment().updateOrderState.done()=' + order?.id,
      );

      // 11. Return with client secret
      return Promise.resolve({
        clientSecret: paymentIntent.client_secret as string,
        status: paymentIntent.status,
      });
    } else {
      //
      // Handle CASH and CARD payment
      console.debug('***** startCashPayment()');

      // 6. Create Transaction
      const createTransactionVars: CrudApi.CreateTransactionMutationVariables =
        {
          input: {
            userId: userId,
            orderId: orderId,
            currency: order.sumPriceShown.currency,
            status: CrudApi.PaymentStatus.waiting_for_payment,
            total: order.sumPriceShown.priceSum,
            type: paymentMethod.toString(),
          },
        };

      console.debug('startCashPayment().creating.transaction');
      const transaction = await createTransaction(createTransactionVars)(deps);
      console.debug('startCashPayment().transaction.id=' + transaction?.id);

      if (!transaction) {
        throw new Error('Transaction not created');
      }

      // 7. Create invoice or receipt
      if (invoiceAddress) {
        console.debug(
          'startCashPayment().invoiceAddress=' + input.invoiceAddress,
        );
        await createInvoiceAndConnectTransaction(
          order.id,
          order.userId,
          transaction.id,
          invoiceAddress,
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
        undefined, // use undefined to prevend graphql api to override this field
        transaction.id,
        // it should be undefined because we don't want to overwrite the field with GraphQL API.
        transaction.status ? transaction.status : undefined,
      )(deps);
      console.debug('startCashPayment().updateOrderState.done()=' + order?.id);

      // 9. Return with success
      return Promise.resolve({
        clientSecret: '',
        status: CrudApi.PaymentStatus.waiting_for_payment,
      });
    }
  };
