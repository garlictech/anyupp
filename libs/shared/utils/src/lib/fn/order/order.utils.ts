import * as CrudApi from '@bgap/crud-gql/api';
import { pipe } from 'fp-ts/function';
import { toFixed2Number } from '../number.utils';

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
export const calculateOrderSumPrice = (
  items: CrudApi.OrderItemInput[],
): CrudApi.PriceShown => pipe(items, sumItems, roundSums);

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
    const itemPrice = calculatePriceShown({
      ...item.priceShown,
      quantity: item.quantity,
    });
    const itemPriceWithConfigSetPrices =
      itemPrice.priceSum + sumItemConfigSetPrices(item) * item.quantity;
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

export const calculatePriceShown = ({
  pricePerUnit,
  quantity,
  tax,
  currency,
}: {
  pricePerUnit: number;
  quantity: number;
  tax: number;
  currency: string;
}): CrudApi.PriceShown => {
  return {
    tax,
    currency,
    pricePerUnit,
    priceSum: pricePerUnit * quantity,
    taxSum: calculateTaxSumFromBrutto({ tax, brutto: pricePerUnit * quantity }),
  };
};

export const calculateTaxSumFromBrutto = ({
  tax,
  brutto,
}: {
  tax: number;
  brutto: number;
}) => (tax / 100 / (1 + tax / 100)) * brutto;
