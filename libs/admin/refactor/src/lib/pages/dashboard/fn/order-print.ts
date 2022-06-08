import {
  LocalizedItem,
  OrderItem,
  Price,
  PriceShown,
  ServingMode,
} from '@bgap/domain';
import { KeyValueObject } from '@bgap/shared/types';

import { net2gross, taxValueFromNetPrice } from '../../../shared/utils';

export const summarizeServiceFeeByTax = (
  serviceFees: KeyValueObject,
  serviceFee: Price,
) => {
  const taxValue = Math.round(
    serviceFee.netPrice * serviceFee.taxPercentage * 0.01,
  );
  const grossPrice = Math.round(serviceFee.netPrice + taxValue);

  return serviceFees[serviceFee.taxPercentage]
    ? {
        ...serviceFees[serviceFee.taxPercentage],
        priceSum: serviceFees[serviceFee.taxPercentage].priceSum + grossPrice,
        taxSum: serviceFees[serviceFee.taxPercentage].taxSum + taxValue,
      }
    : {
        priceSum: grossPrice,
        taxSum: taxValue,
        tax: serviceFee.taxPercentage,
        currency: serviceFee.currency,
      };
};

export const summarizeVariantsByTax =
  (deps: { localizer: (value: LocalizedItem | null | undefined) => string }) =>
  (
    variants: KeyValueObject,
    item: OrderItem,
    orderServingMode: ServingMode,
  ) => {
    const uniqueKey = `${orderServingMode}-${item.variantId}-${(
      item.configSets || []
    )
      .map(set => set.items.map(item => item.productComponentId))
      .reduce((a, b) => a.concat(b), [])
      .sort()
      .join('-')}`;

    return {
      ...variants,
      [uniqueKey]: variants[uniqueKey]
        ? {
            ...variants[uniqueKey],
            quantity: variants[uniqueKey].quantity + item.quantity,
            sumPriceShown: {
              ...variants[uniqueKey].sumPriceShown,
              priceSum:
                variants[uniqueKey].sumPriceShown.priceSum +
                item.sumPriceShown.priceSum,
              taxSum:
                variants[uniqueKey].sumPriceShown.taxSum +
                item.sumPriceShown.taxSum,
            },
          }
        : {
            quantity: item.quantity,
            productName: { ...item.productName },
            sumPriceShown: { ...item.sumPriceShown },
            variantName: { ...item.variantName },
            servingMode: orderServingMode,
            configSets: (item.configSets || [])
              .map(
                set =>
                  `<div>${set.items
                    .map(item => deps.localizer(item.name))
                    .join(', ')}</div>`,
              )
              .join(''),
          },
    };
  };

export const summarizeVatByTax = (
  vats: KeyValueObject,
  sumPriceShown: PriceShown,
) =>
  vats[sumPriceShown.tax]
    ? {
        ...vats[sumPriceShown.tax],
        priceSum: Math.round(
          vats[sumPriceShown.tax].priceSum + sumPriceShown.priceSum,
        ),
        taxSum: Math.round(
          vats[sumPriceShown.tax].taxSum + sumPriceShown.taxSum,
        ),
      }
    : {
        priceSum: Math.round(sumPriceShown.priceSum),
        taxSum: Math.round(sumPriceShown.taxSum),
        tax: sumPriceShown.tax,
        currency: sumPriceShown.currency,
      };

export const increaseVatWithPackagingTax = (
  vats: KeyValueObject,
  packagingSum: Price,
) => {
  const priceSum = Math.round(
    net2gross(packagingSum.netPrice, packagingSum.taxPercentage),
  );
  const taxSum = Math.round(
    taxValueFromNetPrice(packagingSum.netPrice, packagingSum.taxPercentage),
  );

  return vats[packagingSum.taxPercentage]
    ? {
        ...vats[packagingSum.taxPercentage],
        priceSum: Math.round(
          vats[packagingSum.taxPercentage].priceSum + priceSum,
        ),
        taxSum: Math.round(vats[packagingSum.taxPercentage].taxSum + taxSum),
      }
    : {
        priceSum,
        taxSum,
        tax: packagingSum.taxPercentage,
        currency: packagingSum.currency,
      };
};
