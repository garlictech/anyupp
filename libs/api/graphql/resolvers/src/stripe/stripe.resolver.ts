import Stripe from 'stripe';
import { DatabaseService } from '@bgap/api/data-access';
import { Scalars, StripeCard } from '@bgap/api/graphql/schema';
import { getActualStatus, sumOrders } from '@bgap/api/utils';
import {
  EOrderStatus,
  EPaymentMethod,
  IOrders,
  IUser
} from '@bgap/shared/types';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { IOrder } from '@bgap/shared/types';

import {
  amountConversionForStripe,
  mapPaymentMethodToCard
} from './stripe.utils';

// TODO: integrate the secret key from AWS
const STRIPE_CONFIG = {
  stripe_secret_key: 'foobar'
};

@Resolver('Stripe')
export class StripeResolver {
  private stripe: Stripe;
  constructor(private dbService: DatabaseService) {
    this.stripe = new Stripe(STRIPE_CONFIG.stripe_secret_key, {
      apiVersion: '2020-08-27'
    });
  }

  @Query('getCustomerStripeCards')
  async getCustomerStripeCards(
    @Args('customerId') customerId: string
  ): Promise<StripeCard[]> {
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId,
      type: 'card'
    });
    return paymentMethods.data.map(mapPaymentMethodToCard);
  }

  @Mutation('startStripePayment')
  async startPayment(
    @Args('chainId') chainId: Scalars['ID'],
    @Args('userId') userId: Scalars['ID'],
    @Args('unitId') unitId: Scalars['ID']
  ) {
    const orders: IOrders = await this.getInappPaymentReadyOrders({
      chainId,
      unitId,
      userId
    });

    // if (!orders) {
    //   throw orderIsMissingError(); // ERROR
    // }

    const currency = Object.values(
      orders
    )[0].sumPriceShown.currency.toUpperCase();
    const amount = amountConversionForStripe(sumOrders(orders), currency);
    // return orders;
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

    const paymentIntentClientSecret = await this.creatStripeIntent({
      amount,
      currency,
      stripeCustomerId
    });

    return paymentIntentClientSecret;

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

  private async creatStripeIntent({
    amount,
    currency,
    stripeCustomerId
  }: {
    amount: number;
    currency: string;
    stripeCustomerId: string;
  }) {
    const intent = await this.stripe.paymentIntents.create({
      amount,
      currency,
      customer: stripeCustomerId
    });

    return intent.client_secret;
  }

  private async getInappPaymentReadyOrders({
    chainId,
    unitId,
    userId
  }: {
    chainId: string;
    unitId: string;
    userId: string;
  }): Promise<IOrders> {
    const activeOrdersOfTheUser = await this.dbService.getRefValue<IOrders>(
      this.dbService.ordersUsersActiveRef({
        chainId,
        unitId,
        userId
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
            [orderId]: order
          };
        }
        return result;
      },
      {}
    );
  }
}
