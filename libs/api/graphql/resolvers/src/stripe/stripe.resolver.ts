// import * as fbAdmin from 'firebase-admin';
// import Stripe from 'stripe';
// import { v1 as uuidV1 } from 'uuid';

// import { DatabaseService, FirestoreService } from '@bgap/api/shared/data-access';
// import {
//   StartStripePaymentOutput,
//   StripeCard,
// } from '@bgap/api/graphql/schema';
// import { getActualStatus, sumOrders } from '@bgap/api/utils';
// import { SharedSecrets } from '@bgap/shared/secrets';
// import {
//   EOrderStatus,
//   EPaymentMethod,
//   ETransactionType,
//   IOrder,
//   IOrders,
//   ITransaction,
//   IUser,
// } from '@bgap/shared/types';
// import { Inject } from '@nestjs/common';
// import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

// import {
//   amountConversionForStripe,
//   mapPaymentMethodToCard,
// } from './stripe.utils';

// @Resolver('Stripe')
// export class StripeResolver {
//   private stripe: Stripe;
//   constructor(
//     private dbService: DatabaseService,
//     private firestoreService: FirestoreService,
//     @Inject('SHARED_SECRETS') private sharedSecrets: SharedSecrets,
//   ) {
//     this.stripe = new Stripe(sharedSecrets.stripeSecretKey, {
//       apiVersion: '2020-08-27',
//     });
//   }

//   @Query('getCustomerStripeCards')
//   async getCustomerStripeCards(
//     @Args('userId') userId: string,
//   ): Promise<StripeCard[]> {
//     const stripeCustomerId = await this.getStripeCustomerIdForUser({ userId });
//     const paymentMethods = await this.stripe.paymentMethods.list({
//       customer: stripeCustomerId,
//       type: 'card',
//     });
//     return paymentMethods.data.map(mapPaymentMethodToCard);
//   }

//   @Mutation('startStripePayment')
//   async startPayment(
//     @Args('args') args: StartStripePaymentInput,
//   ): Promise<StartStripePaymentOutput> {
//     const { chainId, unitId, userId, paymentMethodId } = args;
//     const orders: IOrders = await this.getInappPaymentReadyOrders({
//       chainId,
//       unitId,
//       userId,
//     });

//     // if (!orders) {
//     //   throw orderIsMissingError(); // ERROR
//     // }

//     const currency = Object.values(
//       orders,
//     )[0].sumPriceShown.currency.toUpperCase();
//     const orderSum = sumOrders(orders);
//     const amount = amountConversionForStripe(orderSum, currency);
//     // return orders;

//     const stripeCustomerId = await this.getStripeCustomerIdForUser({ userId });

//     const paymentIntent = await this.createStripeIntent({
//       amount,
//       currency,
//       stripeCustomerId,
//       paymentMethodId: paymentMethodId ? paymentMethodId : undefined,
//     });

//     if (!paymentIntent.client_secret) {
//       throw new Error('TODOOOOO CLIENT SECRET IS MISSING');
//     }

//     const transactionId = uuidV1();
//     const externalTransactionId = paymentIntent.id;

//     // Create transaction with the external transactionId and status from the request
//     await this.createTransaction({
//       transactionId,
//       chainId,
//       unitId,
//       userId,
//       total: orderSum,
//       currency,
//       orders,
//       externalTransactionId,
//       status: paymentIntent.status,
//     });

//     return {
//       status: paymentIntent.status,
//       clientSecret: paymentIntent.client_secret,
//     };
//   }

//   private async creatStripeCustomer() {
//     // ??? set customer params during creation ???
//     const customer = await this.stripe.customers.create();
//     return customer.id;
//   }

//   private async createStripeIntent({
//     amount,
//     currency,
//     stripeCustomerId,
//     paymentMethodId,
//   }: {
//     amount: number;
//     currency: string;
//     stripeCustomerId: string;
//     paymentMethodId: string | undefined;
//   }): Promise<Stripe.PaymentIntent> {
//     const intent = await this.stripe.paymentIntents.create({
//       amount,
//       currency,
//       customer: stripeCustomerId,
//       payment_method: paymentMethodId,
//     });

//     return intent;
//   }

//   private async getInappPaymentReadyOrders({
//     chainId,
//     unitId,
//     userId,
//   }: {
//     chainId: string;
//     unitId: string;
//     userId: string;
//   }): Promise<IOrders> {
//     const activeOrdersOfTheUser = await this.dbService.getRefValue<IOrders>(
//       this.dbService.ordersUsersActiveRef({
//         chainId,
//         unitId,
//         userId,
//       }),
//     );

//     // if (!activeOrders) {
//     //     throw orderIsMissingError(); // ERROR
//     // }

//     return Object.entries(activeOrdersOfTheUser).reduce(
//       (result, [orderId, order]: [string, IOrder]) => {
//         if (
//           getActualStatus(order.statusLog) === EOrderStatus.READY &&
//           order.paymentMethod === EPaymentMethod.INAPP
//         ) {
//           return {
//             ...result,
//             [orderId]: order,
//           };
//         }
//         return result;
//       },
//       {},
//     );
//   }

//   private async getStripeCustomerIdForUser({ userId }: { userId: string }) {
//     const userRef = this.dbService.userRef(userId);
//     const user = await this.dbService.getRefValue<IUser>(userRef);

//     // if (!user) {
//     //     throw userIsMissingError(); // ERROR
//     // }

//     let stripeCustomerId = user.stripeCustomerId;

//     if (!stripeCustomerId) {
//       stripeCustomerId = await this.creatStripeCustomer();
//       userRef.update({ stripeCustomerId });
//     }

//     return stripeCustomerId;
//   }

//   private async createTransaction({
//     transactionId,
//     chainId,
//     unitId,
//     userId,
//     total,
//     currency,
//     orders,
//     status,
//     externalTransactionId,
//   }: {
//     transactionId: string;
//     chainId: string;
//     unitId: string;
//     userId: string;
//     total: number;
//     currency: string;
//     orders: IOrders;
//     status: string;
//     externalTransactionId: string;
//   }): Promise<void> {
//     const transaction: ITransaction = {
//       createdAt: fbAdmin.firestore.Timestamp.now(),
//       chainId,
//       unitId,
//       userId,
//       type: ETransactionType.STRIPE,
//       orders: Object.keys(orders),
//       total,
//       currency,
//       status, // TODO ??? create status log like the order.status?
//       externalTransactionId,
//     };
//     await this.firestoreService
//       .transactionsRef()
//       .doc(transactionId)
//       .set(transaction);
//   }
// }
