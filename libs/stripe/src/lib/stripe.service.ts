import Stripe from 'stripe';
import { StripeCard } from '@bgap/api/graphql/schema';
import { mapPaymentMethodToCard } from './stripe.utils';
import {
  SharedSecrets,
  sharedSecretsPromise,
  getSecrets,
} from '@bgap/shared/secrets';

export const stripeService = {
  async getCustomerStripeCards(
    // sharedSecrets: SharedSecrets,
    userId: string,
  ): Promise<StripeCard[]> {
    const secrets = await getSecrets();
    // const secrets = await sharedSecretsPromise;
    console.log(
      '### ~ file: stripe.service.ts ~ line 12 ~ secrets',
      Object.keys(secrets),
    );
    const stripe = new Stripe(secrets.stripeSecretKey, {
      apiVersion: '2020-08-27',
    });
    const stripeCustomerId = await getStripeCustomerIdForUser({ userId });
    const paymentMethods = await stripe.paymentMethods.list({
      customer: stripeCustomerId,
      type: 'card',
    });
    return paymentMethods.data.map(mapPaymentMethodToCard);
  },
};

const getStripeCustomerIdForUser = ({ userId }: { userId: string }) => {
  return Promise.resolve('cus_IvqDUayMLk5RMa');
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
};
