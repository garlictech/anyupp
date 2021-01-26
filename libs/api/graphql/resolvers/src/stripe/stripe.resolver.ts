import Stripe from 'stripe';

import {
  CardBrand,
  CountryCode,
  CardFundingType,
  StripeCard,
} from '@bgap/api/graphql/schema';
import { STRIPE_CONFIG } from '@bgap/shared/config';
import { Args, Query, Resolver } from '@nestjs/graphql';

@Resolver('Stripe')
export class StripeResolver {
  private stripe: Stripe;
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
      customer: customerId,
      type: 'card',
    });
    return paymentMethods.data.map(mapPaymentMethodToCard);
  }
}

const mapPaymentMethodToCard = (pm: Stripe.PaymentMethod) => ({
  ...pm.card,
  id: pm.id,
  metadata: Object.entries(pm.metadata).map(mapMetadataToObjectArray),
  object: pm.object,
  brand: CardBrand[pm.card.brand],
  country: CountryCode[pm.card.country],
  funding: CardFundingType[pm.card.funding],
});

// [key, value] => {key:key, value:value}
const mapMetadataToObjectArray = ([key, value]) => ({
  key,
  value,
});
