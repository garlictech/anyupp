import { StripeCard } from '@bgap/domain';

import { mapPaymentMethodToCard, StripeResolverDeps } from '../stripe.utils';
import {
  handleStripeErrors,
  loadAndConnectUserForStripe,
} from './common-stripe';

export const listStripeCards =
  () =>
  async (deps: StripeResolverDeps): Promise<StripeCard[]> => {
    // 1. get userId
    const userId = deps.userId;
    console.debug('listStripeCards().start().userId=' + userId);

    // 2. get User from DynamoDB
    const user = await loadAndConnectUserForStripe(userId)(deps);

    console.debug(
      'listStripeCards().user=' +
        user +
        ', customerId=' +
        user?.stripeCustomerId,
    );

    if (!user || !user.stripeCustomerId) {
      throw Error(
        'User initialization failed. User must have a stripeCustomerId property!',
      );
    }

    console.debug('listStripeCards.start listing payment methods from Stripe.');
    return deps.stripeClient.paymentMethods
      .list({
        customer: user.stripeCustomerId,
        type: 'card',
      })
      .then(paymentMethods => {
        const cards = paymentMethods.data.map(mapPaymentMethodToCard);
        console.debug(
          'listStripeCards.cards=' + JSON.stringify(cards, null, 2),
        );
        return cards;
      })
      .catch(handleStripeErrors);
  };
