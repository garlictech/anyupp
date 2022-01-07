import * as CrudApi from '@bgap/crud-gql/api';
import { mapPaymentMethodToCard, StripeResolverDeps } from '../stripe.utils';
import { loadAndConnectUserForStripe } from './common-stripe';
import Stripe from 'stripe';

export const updateStripeCard =
  (input: CrudApi.StripeCardUpdateInput) =>
  async (deps: StripeResolverDeps): Promise<CrudApi.StripeCard> => {
    const userId = deps.userId;
    console.debug('updateStripeCard().start()');

    const user = await loadAndConnectUserForStripe(userId)(deps);
    console.debug('**** updateStripeCard().user=' + user?.id);
    if (!user) {
      throw Error('User cannot be loaded for Stripe. userId=' + userId);
    }
    console.debug(
      '**** updateStripeCard().user.stripeCustomerId=' + user?.stripeCustomerId,
    );
    if (!user.stripeCustomerId) {
      throw Error('User not have a Stripe customer id. userId=' + userId);
    }
    if (!input.name) {
      throw Error('The card name cannot be empty when updating card.');
    }

    console.debug('**** updateStripeCard().updating card data.');
    const params: Stripe.PaymentMethodUpdateParams = {
      metadata: {
        name: input.name,
      },
    };
    const paymentMethod = await deps.stripeClient.paymentMethods.update(
      input.paymentMethodId,
      params,
    );
    console.debug('**** updateStripeCard().card updated:' + paymentMethod?.id);

    return mapPaymentMethodToCard(paymentMethod);
  };
