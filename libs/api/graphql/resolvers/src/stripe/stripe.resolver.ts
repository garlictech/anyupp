import { Args, Query, Resolver } from '@nestjs/graphql';
import Stripe from 'stripe';

import { STRIPE_CONFIG } from '@bgap/shared/config/stripe';
import {
  Brand,
  CountryCode,
  Funding,
  StripeCard,
} from '@bgap/api/graphql/schema';

@Resolver('Stripe')
export class StripeResolver {
  stripe: Stripe;
  constructor() {
    this.stripe = new Stripe(STRIPE_CONFIG.stripe_secret_key, {
      apiVersion: '2020-08-27',
    });
  }

  @Query('getCustomerStripeCards')
  async getCustomerStripeCards(
    @Args('customerId') customerId: string
  ): Promise<StripeCard[]> {
    const paymentMethods = await this.stripe.paymentMethods.list({
      customer: customerId ? customerId : 'cus_HqrrboxTxefVa3', // TODO: remove default
      type: 'card',
    });
    const cards = paymentMethods.data.map(mapPaymentMethodToCard);
    return cards;
  }
}

const mapPaymentMethodToCard = (pm: Stripe.PaymentMethod) => ({
  ...pm.card,
  id: pm.id,
  metadata: Object.entries(pm.metadata).map(mapMetadataToObjectArray),
  object: pm.object,
  brand: Brand[pm.card.brand],
  country: CountryCode[pm.card.country],
  funding: Funding[pm.card.funding],
});

const mapMetadataToObjectArray = ([key, value]) => ({
  key,
  value,
});
