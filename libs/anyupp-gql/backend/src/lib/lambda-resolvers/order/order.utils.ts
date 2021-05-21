// import { PriceShown, Order, StatusLog, CrudApi.OrderStatus, StatusLogItem } from "../interfaces";
// import { toFixed2Number } from "../utils";
import { CrudApi } from '@bgap/crud-gql/api';
import {
  IOrderItem,
  IOrders,
  IPriceShown,
  IStatusLog,
} from '@bgap/shared/types';

import { toFixed2Number } from '../../utils/number.utils';

export const calculateOrderSumPrice = (
  items: IOrderItem[] | CrudApi.OrderItemInput[],
): IPriceShown => roundSums(sumItems(items as IOrderItem[]));

const sumItems = (items: IOrderItem[]): IPriceShown => {
  const empty: IPriceShown = {
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

    if (lastStatus === CrudApi.OrderStatus.REJECTED) {
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

const roundSums = (price: IPriceShown) => {
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

export const currentStatus = (status: IStatusLog[]): CrudApi.OrderStatus => {
  if (!status || status.length === 0) {
    return CrudApi.OrderStatus.NONE;
  }
  const lastElement = status[status.length - 1];
  return lastElement?.status || CrudApi.OrderStatus.NONE;
};
