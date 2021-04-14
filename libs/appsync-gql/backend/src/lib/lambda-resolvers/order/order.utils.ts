// import { PriceShown, Order, StatusLog, EOrderStatus, StatusLogItem } from "../interfaces";
// import { toFixed2Number } from "../utils";
import { AmplifyApi } from '@bgap/admin/amplify-api';
import { toFixed2Number } from '@bgap/api/utils';
import {
  IOrderItem,
  IOrders,
  IPriceShown,
  IStatusLog,
  IStatusLogItem,
} from '@bgap/shared/types';

export const calculateOrderSumPrice = (
  items: IOrderItem[] | AmplifyApi.OrderItemInput[],
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
    const [key, lastStatus] = getActualStatusLogItem(item.statusLog);

    // TODO: if (!key || lastStatus?.status === EOrderStatus.REJECTED) {
    if (!key || lastStatus?.status === 'REJECTED') {
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

export const getActualStatusLogItem = (
  statusLog: IStatusLog,
): [string, IStatusLogItem] | [] => {
  const statusLogs = Object.entries(statusLog);
  if (statusLogs.length > 0) {
    return statusLogs.pop() || [];
  }
  return [];
};

export const getActualStatus = (
  statusLog: IStatusLog,
  // TODO: ): EOrderStatus | undefined => {
): string | undefined => {
  const [, logItem] = getActualStatusLogItem(statusLog);
  return logItem?.status;
};
