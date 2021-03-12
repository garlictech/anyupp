import { AppsyncApi } from '@bgap/api/graphql/schema';
import { toFixed0Number, toFixed2Number } from '@bgap/api/utils';
import { Stripe } from 'stripe';

export const mapPaymentMethodToCard = (pm: Stripe.PaymentMethod) => ({
  ...pm.card,
  id: pm.id,
  metadata: Object.entries(pm.metadata || {}).map(mapMetadataToObjectArray),
  object: pm.object,
  brand:
    AppsyncApi.CardBrand[pm.card?.brand as keyof typeof AppsyncApi.CardBrand],
  country: pm.card?.country,
  funding:
    AppsyncApi.CardFundingType[
      pm.card?.funding as keyof typeof AppsyncApi.CardFundingType
    ],
});

// [key, value] => {key:key, value:value}
const mapMetadataToObjectArray = ([key, value]: [string, string]) => ({
  key,
  value,
});

// https://stripe.com/docs/currencies#special-cases
export const amountConversionForStripe = (value: number, currency: string) => {
  switch (currency) {
    case 'HUF':
      return toFixed0Number(value) * 100; // Stripe treats the Hungarian Forint (HUF) as a zero-decimal currency
    case 'EUR':
    case 'USD':
    default:
      return toFixed2Number(value);
  }
};

// export const amountConversionFromStripe = (value: number, currency: string) => {
//   switch (currency) {
//     case 'HUF':
//       return value / 100; // Stripe treats the Hungarian Forint (HUF) as a zero-decimal currency
//     case 'EUR':
//     case 'USD':
//     default:
//       return value;
//   }
// };

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
