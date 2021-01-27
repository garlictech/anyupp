import {
  CardBrand,
  CountryCode,
  CardFundingType,
} from '@bgap/api/graphql/schema';
import { Stripe } from 'stripe';

export const mapPaymentMethodToCard = (pm: Stripe.PaymentMethod) => ({
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
