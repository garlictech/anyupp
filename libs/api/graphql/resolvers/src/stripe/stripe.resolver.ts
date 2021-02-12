import Stripe from 'stripe';
import { DatabaseService } from '@bgap/api/data-access';
import {
  StartStripePaymentInput,
  StartStripePaymentOutput,
  StripeCard,
} from '@bgap/api/graphql/schema';
import { getActualStatus, sumOrders } from '@bgap/api/utils';
import {
  EOrderStatus,
  EPaymentMethod,
  IOrders,
  IUser,
} from '@bgap/shared/types';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IOrder } from '@bgap/shared/types';

import {
  amountConversionForStripe,
  mapPaymentMethodToCard,
} from './stripe.utils';
import { Inject } from '@nestjs/common';
import { SharedSecrets } from '@bgap/shared/config';

@Resolver('Stripe')
export class StripeResolver {
  private stripe: Stripe;
  constructor(
    private dbService: DatabaseService,
    @Inject('SHARED_SECRETS') private sharedSecrets: SharedSecrets
  ) {
    this.stripe = new Stripe(sharedSecrets.stripeSecretKey, {
      apiVersion: '2020-08-27',
    });
  }

  @Query('getCustomerStripeCards')
  async getCustomerStripeCards(
    @Args('userId') userId: string
  ): Promise<StripeCard[]> {
    const stripeCustomerId = await this.getStripeCustomerIdForUser({ userId });
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: 'card',
    });
    return paymentMethods.data.map(mapPaymentMethodToCard);
  }

  @Mutation('startStripePayment')
  async startPayment(
    @Args('args') args: StartStripePaymentInput
  ): Promise<StartStripePaymentOutput> {
    const { chainId, unitId, userId, paymentMethodId } = args;
    const orders: IOrders = await this.getInappPaymentReadyOrders({
      chainId,
      unitId,
      userId,
    });

    // if (!orders) {
    //   throw orderIsMissingError(); // ERROR
    // }

    const currency = Object.values(
      orders
    )[0].sumPriceShown.currency.toUpperCase();
    const amount = amountConversionForStripe(sumOrders(orders), currency);
    // return orders;

    const stripeCustomerId = await this.getStripeCustomerIdForUser({ userId });

    const paymentIntentClientSecret = await this.createStripeIntent({
      amount,
      currency,
      stripeCustomerId,
      paymentMethodId: paymentMethodId ? paymentMethodId : undefined,
    });

    if (!paymentIntentClientSecret.client_secret) {
      throw new Error('TODOOOOO CLIENT SECRET IS MISSING');
    }

    return {
      status: paymentIntentClientSecret.status,
      clientSecret: paymentIntentClientSecret.client_secret,
    };

    // const transactionId = nanoid();

    // const paymentData = getRequestBody({ currency, user, total, orderRef: transactionId });
    // const simpleResponse = await callSimpleApi(http)(paymentData);
    // console.log("###: SimplePayStartResponse", JSON.stringify(simpleResponse));
    // checkSimpleError(simpleResponse);
    // checkSignature(simpleResponse.headers.signature, simpleResponse.bodyPlainText);

    // const externalTransactionId = simpleResponse.body.transactionId;
    // const paymentUrl = simpleResponse.body.paymentUrl;

    // // Create transaction with the external transactionId and status from the simple request
    // await createTransaction({
    //     fContext,
    //     transactionId,
    //     chainId,
    //     unitId,
    //     userId,
    //     total,
    //     currency,
    //     orders,
    //     externalTransactionId,
    //     status: ESimplePaymentStatus.INIT,
    // });

    // return {
    //   transactionId,
    //   paymentUrl,
    //   paymentUrl,
    // };
  }

  private async creatStripeCustomer() {
    // ??? set customer params during creation ???
    const customer = await this.stripe.customers.create();
    return customer.id;
  }

  private async createStripeIntent({
    amount,
    currency,
    stripeCustomerId,
    paymentMethodId,
  }: {
    amount: number;
    currency: string;
    stripeCustomerId: string;
    paymentMethodId: string | undefined;
  }): Promise<Stripe.PaymentIntent> {
    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      customer: stripeCustomerId,
      payment_method: paymentMethodId,
    });

    return intent;
  }

  private async getInappPaymentReadyOrders({
    chainId,
    unitId,
    userId,
  }: {
    chainId: string;
    unitId: string;
    userId: string;
  }): Promise<IOrders> {
    const activeOrdersOfTheUser = await this.dbService.getRefValue<IOrders>(
      this.dbService.ordersUsersActiveRef({
        chainId,
        unitId,
        userId,
      })
    );

    // if (!activeOrders) {
    //     throw orderIsMissingError(); // ERROR
    // }

    return Object.entries(activeOrdersOfTheUser).reduce(
      (result, [orderId, order]: [string, IOrder]) => {
        if (
          getActualStatus(order.statusLog) === EOrderStatus.READY &&
          order.paymentMethod === EPaymentMethod.INAPP
        ) {
          return {
            ...result,
            [orderId]: order,
          };
        }
        return result;
      },
      {}
    );
  }

  private async getStripeCustomerIdForUser({ userId }: { userId: string }) {
    const userRef = this.dbService.userRef(userId);
    const user = await this.dbService.getRefValue<IUser>(userRef);

    // if (!user) {
    //     throw userIsMissingError(); // ERROR
    // }

    let stripeCustomerId = user.stripeCustomerId;

    if (!stripeCustomerId) {
      stripeCustomerId = await this.creatStripeCustomer();
      userRef.update({ stripeCustomerId });
    }

    return stripeCustomerId;
  }
}
