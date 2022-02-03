import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValueObject } from '@bgap/shared/types';

export const summarizeServiceFeeByTax = (
  serviceFees: KeyValueObject,
  serviceFee: CrudApi.Price,
) =>
  serviceFees[serviceFee.taxPercentage]
    ? {
        ...serviceFees[serviceFee.taxPercentage],
        priceSum:
          serviceFees[serviceFee.taxPercentage].priceSum + serviceFee.netPrice,
        taxSum:
          serviceFees[serviceFee.taxPercentage].taxSum +
          serviceFee.taxPercentage,
      }
    : {
        priceSum: serviceFee.netPrice,
        taxSum: serviceFee.taxPercentage,
        tax: serviceFee.taxPercentage,
        currency: serviceFee.currency,
      };

export const summarizeVariantsByTax =
  (deps: {
    localizer: (value: CrudApi.LocalizedItem | null | undefined) => string;
  }) =>
  (variants: KeyValueObject, item: CrudApi.OrderItem) => {
    const uniqueKey = `${item.variantId}-${(item.configSets || [])
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
  sumPriceShown: CrudApi.PriceShown,
) =>
  vats[sumPriceShown.tax]
    ? {
        ...vats[sumPriceShown.tax],
        priceSum: vats[sumPriceShown.tax].priceSum + sumPriceShown.priceSum,
        taxSum: vats[sumPriceShown.tax].taxSum + sumPriceShown.taxSum,
      }
    : {
        priceSum: sumPriceShown.priceSum,
        taxSum: sumPriceShown.taxSum,
        tax: sumPriceShown.tax,
        currency: sumPriceShown.currency,
      };
