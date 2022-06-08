import Stripe from 'stripe';

import {
  CreateTransactionMutationVariables,
  InvoiceStatus,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  StartStripePaymentInput,
  StartStripePaymentOutput,
} from '@bgap/domain';
import { toFixed0Number } from '@bgap/shared/utils';

import { createInvoiceAndConnectTransaction } from '../invoice-receipt.utils';
import {
  createTransaction,
  loadOrder,
  loadUnit,
  updateOrderState,
} from '../stripe-graphql-crud';
import { StripeResolverDeps } from '../stripe.utils';
import { loadAndConnectUserForStripe } from './common-stripe';

// START PAYMENT INTENTION should use indempotency key https://stripe.com/docs/api/idempotent_requests?lang=node (Covered by #804)
export const startStripePayment =
  (input: StartStripePaymentInput) =>
  async (deps: StripeResolverDeps): Promise<StartStripePaymentOutput> => {
    const userId = deps.userId;
    console.debug('startStripePaymentV2().start()');

    // 1. Get parameters, orderId and payment method
    const {
      orderId,
      paymentMethod,
      paymentMethodId,
      savePaymentMethod,
      invoiceAddress,
    } = input;
    console.debug(
      'startStripePaymentV2().orderId=' +
        orderId +
        ', paymentMethod=' +
        paymentMethod +
        ', paymentMethodId=' +
        paymentMethodId +
        ', saveCard=' +
        savePaymentMethod,
    );

    if (paymentMethod == PaymentMethod.inapp && !paymentMethodId) {
      throw Error(
        'Payment method is missing from request when payment mode is INAPP!',
      );
    }
    console.debug('startStripePaymentV2().invoiceAddress=' + invoiceAddress);

    // 2. Load order
    let order = await loadOrder(orderId)(deps);
    console.debug('startStripePaymentV2().order.loaded=' + order?.id);

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

    const status =
      order.currentStatus ||
      order.statusLog[order.statusLog.length - 1]?.status ||
      OrderStatus.none;

    if (status != OrderStatus.none) {
      throw Error(
        'Order status must be OrderStatus.NONE if you want to pay the order! Current status:' +
          status +
          ', id=' +
          order.id,
      );
    }

    // 3. Load unit
    console.debug('startStripePaymentV2().loading unit()=' + order.unitId);
    const unit = await loadUnit(order.unitId)(deps);
    console.debug('startStripePaymentV2().unit().loaded=' + unit?.id);
    if (!unit) {
      throw Error('Unit not found with id=' + order.unitId);
    }

    // 4. Load User
    const createStripeCustomer = paymentMethod == PaymentMethod.inapp;

    const user = await loadAndConnectUserForStripe(
      userId,
      createStripeCustomer,
      input.invoiceAddress,
    )(deps);
    console.debug('startStripePaymentV2().user.loaded=' + user?.id);

    if (!user) {
      throw Error(
        'User initialization failed. User not loaded (and maybe not created)!',
      );
    }

    if (paymentMethod == PaymentMethod.inapp && !user.stripeCustomerId) {
      throw Error(
        'User initialization failed. User must have a stripeCustomerId property!',
      );
    }

    const serviceFee = order.serviceFee?.grossPrice
      ? order.serviceFee.grossPrice
      : 0;
    const total = order.sumPriceShown.priceSum + serviceFee;

    // 5. Handle INAPP payment
    if (paymentMethod == PaymentMethod.inapp) {
      if (!paymentMethodId) {
        throw Error(
          'Payment method is missing from request when payment mode is INAPP!',
        );
      }

      if (!user.stripeCustomerId) {
        throw Error(
          "User don't have a stripeCustomerId property, but it is mandatory for INAPP payment mode!",
        );
      }

      // 5b. Save card for later use
      if (savePaymentMethod === true) {
        await deps.stripeClient.paymentMethods.attach(
          input.paymentMethodId as string,
          {
            customer: user.stripeCustomerId,
          },
        );
      }

      let customerId = user.stripeCustomerId;
      console.debug('startStripePaymentV2().original.customerId=' + customerId);

      const stripeAmount: number =
        order.sumPriceShown.currency === 'HUF'
          ? toFixed0Number(total * 100)
          : total;

      // 5. Create payment intent data
      const paymentIntentData: Stripe.PaymentIntentCreateParams = {
        amount: stripeAmount,
        currency: order.sumPriceShown.currency,
        payment_method: paymentMethodId,
        payment_method_types: ['card'],
        customer: customerId,
      };

      let stripeOptions: Stripe.RequestOptions | undefined = undefined;
      // 6. Clone customer and payment method
      if (unit.merchantId) {
        console.debug(
          'startStripePaymentV2().set merchantId=' + unit.merchantId,
        );
        paymentIntentData.application_fee_amount = 0;
        stripeOptions = {
          stripeAccount: unit.merchantId,
        };
        // 6c. Clone Payment Method
        console.debug(
          'startStripePaymentV2().Cloning payment method=' + paymentMethodId,
        );
        const clonedPaymentMethod =
          await deps.stripeClient.paymentMethods.create(
            {
              customer: user.stripeCustomerId,
              payment_method: paymentMethodId,
            },
            stripeOptions,
          );
        console.debug(
          'startStripePaymentV2().Payment method Cloned. Cloned id=' +
            clonedPaymentMethod?.id,
        );
        paymentIntentData.payment_method = clonedPaymentMethod.id;

        console.debug(
          'startStripePaymentV2().Creating merchant customer=' +
            user.stripeCustomerId,
        );
        const stripeCustomer: Stripe.Response<Stripe.Customer> =
          await deps.stripeClient.customers.create(
            {
              payment_method: clonedPaymentMethod.id,
            },
            {
              stripeAccount: unit.merchantId,
            },
          );
        customerId = stripeCustomer.id;
        console.debug(
          'startStripePaymentV2().New merchant customerId=' + customerId,
        );
        paymentIntentData.customer = customerId;
      }

      console.debug(
        'startStripePaymentV2().paymentIntentData',
        paymentIntentData,
      );
      console.debug('startStripePaymentV2().stripeOptions', stripeOptions);

      // 7. Create payment intent
      console.debug('startStripePaymentV2().creating payment intent.');
      const paymentIntent = await deps.stripeClient.paymentIntents.create(
        paymentIntentData,
        stripeOptions,
      );
      console.debug(
        'startStripePaymentV2().payment intent created=' + paymentIntent.id,
      );

      // 8. Create Transaction
      const createTransactionVars: CreateTransactionMutationVariables = {
        input: {
          userId: userId,
          orderId: orderId,
          currency: order.sumPriceShown.currency,
          status: PaymentStatus.waiting_for_payment, // shouldn't we use statusLog instead of the simple actual status ? (Covered by #945)
          externalTransactionId: paymentIntent.id,
          total,
          type: 'stripe',
          paymentMethodId,
        },
      };
      const transaction = await createTransaction(createTransactionVars)(deps);
      console.debug('startStripePaymentV2().transaction.id=' + transaction?.id);

      if (!transaction) {
        throw new Error('Transaction not created');
      }

      // 9. Create invoice if requested
      if (invoiceAddress) {
        console.debug(
          'startStripePaymentV2().createInvoiceAndConnectTransaction()=' +
            invoiceAddress,
        );
        // Create Invoice
        await createInvoiceAndConnectTransaction(
          order.id,
          order.userId,
          transaction.id,
          invoiceAddress,
          InvoiceStatus.waiting,
        )(deps);
      }

      // 10. Update ORDER STATUS
      order = await updateOrderState(
        order.id,
        undefined, // use undefined to prevend graphql api to override this field
        transaction.id,
        // it should be undefined because we don't want to overwrite the field with GraphQL API.
        transaction.status ? transaction.status : undefined,
      )(deps);
      console.debug(
        'startStripePaymentV2().updateOrderState.done()=' + order?.id,
      );

      // 11. Return with client secret
      return Promise.resolve({
        clientSecret: paymentIntent.client_secret as string,
        status: paymentIntent.status,
        paymentMethodId: paymentIntentData.payment_method,
        stripeAccount: unit.merchantId,
      });
    } else {
      //
      // Handle CASH and CARD payment
      console.debug('***** startCashPayment()');

      // 6. Create Transaction
      const createTransactionVars: CreateTransactionMutationVariables = {
        input: {
          userId: userId,
          orderId: orderId,
          currency: order.sumPriceShown.currency,
          status: PaymentStatus.waiting_for_payment,
          total,
          type: paymentMethod.toString(),
          paymentMethodId,
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
          InvoiceStatus.success,
        )(deps);
      } else {
        // await createReceiptAndConnectTransaction(
        //   order.id,
        //   order.userId,
        //   transaction.id,
        //   user.email,
        //   ReceiptStatus.success,
        // );
      }

      // 8. Update order
      order = await updateOrderState(
        order.id,
        undefined, // use undefined to prevend graphql api to override this field
        transaction.id,
        // it should be undefined because we don't want to overwrite the field with GraphQL API.
        transaction.status ? transaction.status : undefined,
      )(deps);
      console.debug('startCashPayment().updateOrderState.done()=' + order?.id);

      // 9. Return with success
      return Promise.resolve({
        clientSecret: '',
        status: PaymentStatus.waiting_for_payment,
      });
    }
  };
