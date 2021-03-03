import Stripe from 'stripe';
import { mapPaymentMethodToCard, mapStripeCardToCard } from './stripe.utils';
import { SharedSecrets, sharedSecretsPromise } from '@bgap/shared/secrets';
import { AppsyncApi } from '@bgap/api/graphql/schema';

export const stripeService = {
  async getStripeCardsForCustomer(
    stripeCustomerId: string,
  ): Promise<AppsyncApi.StripeCard[]> {
    const secrets: SharedSecrets = await sharedSecretsPromise;
    const stripe = new Stripe(secrets.stripeSecretKey, {
      apiVersion: '2020-08-27',
    });
    // const stripeCustomerId = await getStripeCustomerIdForUser({ customerId });
    // TODO: use stripe.customers.listSources https://stripe.com/docs/api/cards/list?lang=node
    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: 'card',
    });
    return paymentMethods.data.map(mapPaymentMethodToCard);
  },

  async updateStripeCard(
    stripeCustomerId: string,
    input: AppsyncApi.StripeCardUpdateInput,
  ): Promise<AppsyncApi.StripeCard> {
    const secrets: SharedSecrets = await sharedSecretsPromise;
    const stripe = new Stripe(secrets.stripeSecretKey, {
      apiVersion: '2020-08-27',
    });

    const updatedCard = await stripe.customers.updateSource(
      stripeCustomerId,
      input.id,
      {
        exp_month: input.exp_month || undefined,
        exp_year: input.exp_year || undefined,
        name: input.name || undefined,
        // default_for_currency: input.default_for_currency || undefined,
      },
    );
    return mapStripeCardToCard(updatedCard as Stripe.Card);
  },
};

// const getStripeCustomerIdForUser = ({ userId }: { userId: string }) => {
//   return Promise.resolve('cus_IvqDUayMLk5RMa');
// const userRef = this.dbService.userRef(userId);
// const user = await this.dbService.getRefValue<IUser>(userRef);

// // if (!user) {
// //     throw userIsMissingError(); // ERROR
// // }

// let stripeCustomerId = user.stripeCustomerId;

// if (!stripeCustomerId) {
//   stripeCustomerId = await this.creatStripeCustomer();
//   userRef.update({ stripeCustomerId });
// }

// return stripeCustomerId;
// };
