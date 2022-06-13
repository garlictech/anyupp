import Stripe from 'stripe';

import {
  CreateTransactionMutationVariables,
  PaymentMethod,
  PaymentStatus,
  PayTipWithStripeInput,
  StartStripePaymentOutput,
  TipType,
} from '@bgap/domain';
import { toFixed0Number } from '@bgap/shared/utils';

import { createTransaction, loadOrder, loadUnit } from '../stripe-graphql-crud';
import { StripeResolverDeps } from '../stripe.utils';
import { loadAndConnectUserForStripe } from './common-stripe';

export const payTipWithStripe =
  (input: PayTipWithStripeInput) =>
  async (deps: StripeResolverDeps): Promise<StartStripePaymentOutput> => {
    const userId = deps.userId;
    console.debug('startStripePayment().start()');

    // 1. Get parameters, orderId and payment method
    const { orderId } = input;
    console.debug('startStripePayment().orderId=' + orderId);

    const order = await loadOrder(orderId)(deps);

    if (!order) {
      throw Error('Order not found with id=' + orderId);
    }

    const paymentMethod = order?.paymentMode?.method;
    const paymentMethodId = order?.transaction?.paymentMethodId;

    if (paymentMethod == PaymentMethod.inapp && !paymentMethodId) {
      throw Error(
        'Payment method is missing from request when payment mode is INAPP!',
      );
    }

    if (userId !== order.userId) {
      throw Error(
        "The Order must belongs to the user, the Order's userId field is not match with the logined User's id! Details: order.userId=" +
          order.userId +
          ' vs userId=' +
          userId,
      );
    }

    // 3. Load User
    const createStripeCustomer = paymentMethod == PaymentMethod.inapp;
    const user = await loadAndConnectUserForStripe(
      userId,
      createStripeCustomer,
    )(deps);
    console.debug('startStripePayment().user.loaded=' + user?.id);

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

    // 4. Load unit
    console.debug('startStripePayment().loading unit()=' + order.unitId);
    const unit = await loadUnit(order.unitId)(deps);
    console.debug('startStripePayment().unit().loaded=' + unit?.id);
    if (!unit) {
      throw Error('Unit not found with id=' + order.unitId);
    }

    // 5. Handle INAPP payment
    if (paymentMethod == PaymentMethod.inapp) {
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

      const amount =
        input.tip.type === TipType.percent
          ? (order.sumPriceShown.priceSum * input.tip.value) / 100
          : input.tip.value;

      const currency = order.sumPriceShown.currency;

      const stripeAmount: number =
        currency === 'HUF' ? toFixed0Number(amount * 100) : amount;

      // 6a. Create payment intent data
      const paymentIntentData: Stripe.PaymentIntentCreateParams = {
        amount: stripeAmount,
        currency,
        payment_method: paymentMethodId,
        payment_method_types: ['card'],
        customer: user.stripeCustomerId,
        statement_descriptor_suffix: 'tip',
      };

      // 6b. Add optional merchantId to the payment
      if (unit?.merchantId) {
        console.debug('startStripePayment().set merchantId=' + unit.merchantId);
        paymentIntentData.application_fee_amount = 0;
        paymentIntentData.transfer_data = {
          destination: unit.merchantId,
        };
      }

      // 7. Create payment intent
      const paymentIntent = await deps.stripeClient.paymentIntents.create(
        paymentIntentData,
      );
      console.debug(
        'startStripePayment().payment intent created=' + paymentIntent.id,
      );

      // 8. Create Transaction
      const createTransactionVars: CreateTransactionMutationVariables = {
        input: {
          userId: userId,
          orderId: orderId,
          currency,
          status: PaymentStatus.waiting_for_payment, // shouldn't we use statusLog instead of the simple actual status ? (Covered by #945)
          externalTransactionId: paymentIntent.id,
          total: amount,
          type: 'stripe',
          paymentMethodId,
        },
      };

      const transaction = await createTransaction(createTransactionVars)(deps);
      console.debug('startStripePayment().transaction.id=' + transaction?.id);

      if (!transaction) {
        throw new Error('Transaction not created');
      }

      await deps.crudSdk
        .UpdateOrder({
          input: {
            id: orderId,
            tip: input.tip,
            tipTransactionStatus: transaction.status,
            tipTransactionId: transaction.id,
          },
        })
        .toPromise();

      console.debug(
        'startStripePayment().updateOrderState.done()=' + order?.id,
      );

      // 11. Return with client secret
      return Promise.resolve({
        clientSecret: paymentIntent.client_secret as string,
        status: paymentIntent.status,
      });
    } else {
      throw new Error('Unsupported tip payment method');
    }
  };
