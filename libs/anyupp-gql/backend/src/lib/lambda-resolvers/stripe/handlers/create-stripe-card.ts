import Stripe from 'stripe';

import { StripeCard, StripeCardCreateInput } from '@bgap/domain';

import { mapPaymentMethodToCard, StripeResolverDeps } from '../stripe.utils';
import { loadAndConnectUserForStripe } from './common-stripe';

export const createStripeCard =
  (input: StripeCardCreateInput) =>
  async (deps: StripeResolverDeps): Promise<StripeCard> => {
    const userId = deps.userId;
    console.debug('**** createStripeCard().start()');

    const user = await loadAndConnectUserForStripe(userId)(deps);
    console.debug('**** createStripeCard().user=' + user?.id);
    if (!user) {
      throw Error('User cannot be loaded for Stripe. userId=' + userId);
    }
    console.debug(
      '**** createStripeCard().user.stripeCustomerId=' + user?.stripeCustomerId,
    );
    if (!user.stripeCustomerId) {
      throw Error('User not have a Stripe customer id. userId=' + userId);
    }

    const params: Stripe.PaymentMethodCreateParams = {
      type: 'card',
      // customer: user.stripeCustomerId,
      metadata: {
        name: input.name,
      },
      card: {
        number: input.card_number,
        exp_month: input.exp_month,
        exp_year: input.exp_year,
        cvc: input.cvc,
      },
    };
    console.debug('**** createStripeCard().creating card()');
    const paymentMethod = await deps.stripeClient.paymentMethods.create(params);
    console.debug(
      '**** createStripeCard().paymentMethod created=' + paymentMethod?.id,
    );

    console.debug('**** createStripeCard().attaching to customer()');
    await deps.stripeClient.paymentMethods.attach(paymentMethod.id, {
      customer: user.stripeCustomerId,
    });
    console.debug(
      '**** createStripeCard().Payment method successfully attached to customer.',
    );
    return mapPaymentMethodToCard(paymentMethod);
  };
