// import { PriceShown, Order, StatusLog, EOrderStatus, StatusLogItem } from "../interfaces";
// import { toFixed2Number } from "../utils";
import {
  IStatusLog,
  IStatusLogItem,
  EOrderStatus,
  IOrders,
} from '@bgap/shared/types';

// export const calculateOrderSumPrice = (order: Order): PriceShown => roundSums(sumItems(order));

// const sumItems = (order: Order): PriceShown =>
//     order.items.reduce(
//         (sum, item) => {
//             const [key, lastStatus] = getActualStatusLogItem(item.statusLog);

//             if (!key || lastStatus?.status === EOrderStatus.REJECTED) {
//                 return sum;
//             }
//             return {
//                 priceSum: sum.priceSum + item.priceShown.priceSum,
//                 taxSum: sum.taxSum + item.priceShown.taxSum,
//                 currency: item.priceShown.currency,
//             };
//         },
//         {
//             currency: "",
//             priceSum: 0,
//             taxSum: 0,
//         }
//     );

// const roundSums = ({ currency, priceSum, taxSum }: PriceShown) => {
//     return {
//         currency,
//         priceSum: toFixed2Number(priceSum),
//         taxSum: toFixed2Number(taxSum),
//     };
// };

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
): EOrderStatus | undefined => {
  const [, logItem] = getActualStatusLogItem(statusLog);
  return logItem?.status;
};
