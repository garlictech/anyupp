// import { PriceShown, Order, StatusLog, EOrderStatus, StatusLogItem } from "../interfaces";
// import { toFixed2Number } from "../utils";
import { toFixed2Number } from '@bgap/api/utils';
import {
  IStatusLog,
  IStatusLogItem,
  // EOrderStatus,
  IOrders,
  IOrder,
  IPriceShown,
} from '@bgap/shared/types';

export const calculateOrderSumPrice = (order: IOrder): IPriceShown =>
  roundSums(sumItems(order));

const sumItems = (order: IOrder): IPriceShown =>
  order.items.reduce(
    (sum, item) => {
      const [key, lastStatus] = getActualStatusLogItem(item.statusLog);

      // TODO: if (!key || lastStatus?.status === EOrderStatus.REJECTED) {
      if (!key || lastStatus?.status === 'REJECTED') {
        return sum;
      }
      return {
        priceSum: sum.priceSum + item.priceShown.priceSum,
        taxSum: sum.taxSum + item.priceShown.taxSum,
        currency: item.priceShown.currency,
      };
    },
    {
      currency: '',
      priceSum: 0,
      taxSum: 0,
    },
  );

const roundSums = ({ currency, priceSum, taxSum }: IPriceShown) => {
  return {
    currency,
    priceSum: toFixed2Number(priceSum),
    taxSum: toFixed2Number(taxSum),
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
