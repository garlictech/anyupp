import * as CrudApi from '@bgap/crud-gql/api';
import { pipe } from 'fp-ts/function';
import { toFixed2Number } from '../number.utils';

const roundSums = (price: CrudApi.PriceShown) => {
  return {
    ...price,
    priceSum: toFixed2Number(price.priceSum),
    taxSum: toFixed2Number(price.taxSum),
  };
};

export const currentStatus = (
  status: CrudApi.Maybe<CrudApi.StatusLog>[],
): CrudApi.OrderStatus => {
  if (!status || status.length === 0) {
    return CrudApi.OrderStatus.none;
  }
  const lastElement = status[status.length - 1];
  return lastElement?.status || CrudApi.OrderStatus.none;
};

const sumItemConfigSetPrices = (item: CrudApi.OrderItem): number => {
  if (!item.configSets) {
    return 0;
  }

  return item.configSets.reduce((sum, configSet) => {
    return (
      sum +
      configSet.items.reduce((sum, configComponent) => {
        return sum + configComponent.price;
      }, 0)
    );
  }, 0);
};

export const calculateTaxSumFromBrutto = ({
  tax,
  brutto,
}: {
  tax: number;
  brutto: number;
}): number => (tax / 100 / (1 + tax / 100)) * brutto;

const calculateItemPriceWithConfigSets = (item: CrudApi.OrderItem): number =>
  item.priceShown.pricePerUnit * item.quantity +
  sumItemConfigSetPrices(item) * item.quantity;

const calculatePriceShown = (item: CrudApi.OrderItem): CrudApi.PriceShown => {
  return {
    tax: item.priceShown.tax,
    currency: item.priceShown.currency,
    pricePerUnit: item.priceShown.pricePerUnit,
    priceSum: item.priceShown.pricePerUnit * item.quantity,
    taxSum: calculateTaxSumFromBrutto({
      tax: item.priceShown.tax,
      brutto: item.priceShown.pricePerUnit * item.quantity,
    }),
  };
};

const calculateItemPriceShownWithConfigSets = (
  item: CrudApi.OrderItem,
): CrudApi.PriceShown => {
  const itemPriceWithConfigSetPrices = calculateItemPriceWithConfigSets(item);
  return {
    tax: item.priceShown.tax,
    currency: item.priceShown.currency,
    pricePerUnit: item.priceShown.pricePerUnit,
    priceSum: itemPriceWithConfigSetPrices,
    taxSum: calculateTaxSumFromBrutto({
      tax: item.priceShown.tax,
      brutto: itemPriceWithConfigSetPrices,
    }),
  };
};

const sumItems = (items: CrudApi.OrderItem[]): CrudApi.PriceShown => {
  const initValue: CrudApi.PriceShown = {
    currency: '',
    priceSum: 0,
    pricePerUnit: 0,
    tax: 0,
    taxSum: 0,
  };
  if (!items) {
    return initValue;
  }
  return items.reduce((sum, item) => {
    const lastStatus = currentStatus(item.statusLog);

    if (lastStatus === CrudApi.OrderStatus.rejected) {
      return sum;
    }
    const itemPriceWithConfigSetPrices = calculateItemPriceWithConfigSets(item);
    const itemTaxSum = calculateTaxSumFromBrutto({
      tax: item.priceShown.tax,
      brutto: itemPriceWithConfigSetPrices,
    });
    return {
      priceSum: sum.priceSum + itemPriceWithConfigSetPrices,
      taxSum: sum.taxSum + itemTaxSum,
      currency: item.priceShown.currency,
      tax: 0,
      pricePerUnit: 0,
    };
  }, initValue);
};

/**
 * RE-calculate all the item prices without rounding on any of them.
 * Calculate the configSet prices too on each orderItem.
 *
 * Only the result will be rounded and only once at the end.
 *
 * @param items OrderItems
 * @returns a complete PriceShown but the tax and pricePerUnit are 0
 *  because those have no meaning in a summarized object
 */
export const calculateOrderSumPriceRounded = (
  items: CrudApi.OrderItemInput[],
): CrudApi.PriceShown => pipe(items, sumItems, roundSums);

/**
 * With ConfigSets
 *
 * @param item OrderItem
 * @returns a complete recalculate PriceShown object with added config set prices
 */
export const calculateOrderItemSumPriceRounded = (
  item: CrudApi.OrderItemInput,
): CrudApi.PriceShown =>
  pipe(item, calculateItemPriceShownWithConfigSets, roundSums);

export const calculateOrderItemPriceRounded = (
  item: CrudApi.OrderItemInput,
): CrudApi.PriceShown => pipe(item, calculatePriceShown, roundSums);
