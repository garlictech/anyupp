import {
  CardBrand,
  CountryCode,
  CardFundingType,
} from '@bgap/api/graphql/schema';
import { toFixed0Number, toFixed2Number } from '@bgap/api/utils';
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

// https://stripe.com/docs/currencies#special-cases
export const amountConversionForStipe = (value: number, currency: string) => {
  switch (currency) {
    case 'HUF':
      return toFixed0Number(value) * 100; // Stripe treats the Hungarian Forint (HUF) as a zero-decimal currency
    case 'EUR':
    case 'USD':
    default:
      return toFixed2Number(value);
  }
};

// const toFixedByCurrency = (value: number, currency: string) => {
//   switch (currency) {
//     case 'HUF':
//       return toFixed0Number(value);
//     case 'EUR':
//     case 'USD':
//     default:
//       return toFixed2Number(value);
//   }
// };
