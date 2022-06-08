import { Stripe } from 'stripe';
import * as Szamlazz from 'szamlazz.js';

import { CrudSdk } from '@bgap/crud-gql/api';
import { CardBrand, CardFundingType, StripeCard } from '@bgap/domain';
import { toFixed0Number, toFixed2Number } from '@bgap/shared/utils';

export interface StripeResolverDepsUnauth {
  crudSdk: CrudSdk;
  szamlazzClient: Szamlazz.Client;
  stripeClient: Stripe;
}

export interface StripeResolverDeps extends StripeResolverDepsUnauth {
  userId: string;
}

export const mapPaymentMethodToCard = (
  pm: Stripe.PaymentMethod,
): StripeCard => ({
  id: pm.id,
  name: pm.metadata?.name,
  country: pm.card?.country,
  last4: pm.card?.last4,
  exp_month: pm.card?.exp_month,
  exp_year: pm.card?.exp_year,
  checks: {
    address_line1_check: pm.card?.checks?.address_line1_check,
    address_postal_code_check: pm.card?.checks?.address_postal_code_check,
    cvc_check: pm.card?.checks?.cvc_check,
  },
  brand: convertBrand(pm.card),
  funding: convertFunding(pm.card),
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

export const mapStripeCardToCard = (card: Stripe.Card): StripeCard => ({
  ...card,
  // id: card.id,
  // metadata: convertCardMetadata(card.metadata),
  // object: card.object,
  // brand: CardBrand[card.brand as keyof typeof CardBrand],
  // country: card.country,
  // funding:
  //   CardFundingType[
  //     card.funding as keyof typeof CardFundingType
  //   ],
  brand: convertBrand(card),
  funding: convertFunding(card),
  // name: card.name,
  // exp_year: card.exp_year,
  // exp_month: card.exp_month,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
});

//const convertCardMetadata = (metadata: Stripe.Metadata | null) =>
//  Object.entries(metadata || {}).map(mapMetadataToObjectArray);

const convertBrand = (
  card: Stripe.Card | Stripe.PaymentMethod.Card | undefined,
) => CardBrand[card?.brand as keyof typeof CardBrand];

const convertFunding = (
  card: Stripe.Card | Stripe.PaymentMethod.Card | undefined,
) => CardFundingType[card?.funding as keyof typeof CardFundingType];

// [key, value] => {key:key, value:value}
/*const mapMetadataToObjectArray = ([key, value]: [string, string]) => ({
  key,
  value,
});*/

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
