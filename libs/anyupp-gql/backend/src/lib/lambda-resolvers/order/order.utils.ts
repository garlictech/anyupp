// import { PriceShown, Order, StatusLog, CrudApi.OrderStatus, StatusLogItem } from "../interfaces";
// import { toFixed2Number } from "../utils";
import * as CrudApi from '@bgap/crud-gql/api';
import { IOrders } from '@bgap/shared/types';
import { toFixed2Number } from '../../utils/number.utils';

export const calculateOrderSumPrice = (
  items: CrudApi.OrderItemInput[],
): CrudApi.PriceShown => roundSums(sumItems(items));

const sumItems = (items: CrudApi.OrderItem[]): CrudApi.PriceShown => {
  const empty: CrudApi.PriceShown = {
    currency: '',
    priceSum: 0,
    pricePerUnit: 0,
    tax: 0,
    taxSum: 0,
  };
  if (!items) {
    return empty;
  }
  return items.reduce((sum, item) => {
    const lastStatus = currentStatus(item.statusLog);

    if (lastStatus === CrudApi.OrderStatus.rejected) {
      return sum;
    }
    return {
      priceSum: sum.priceSum + item.priceShown.priceSum,
      taxSum: sum.taxSum + item.priceShown.taxSum,
      currency: item.priceShown.currency,
      tax: item.priceShown.tax,
      pricePerUnit: item.priceShown.pricePerUnit,
    };
  }, empty);
};

const roundSums = (price: CrudApi.PriceShown) => {
  return {
    ...price,
    priceSum: toFixed2Number(price.priceSum),
    taxSum: toFixed2Number(price.taxSum),
  };
};

export const sumOrders = (orders: IOrders): number => {
  return Object.values(orders).reduce((result, order) => {
    return result + order.sumPriceShown.priceSum;
  }, 0);
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
