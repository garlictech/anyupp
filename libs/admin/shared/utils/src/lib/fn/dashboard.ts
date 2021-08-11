import * as CrudApi from '@bgap/crud-gql/api';
import {
  EProductType,
  IKeyValueObject,
  IOrderAmount,
  IOrderAmounts,
  UnpayCategoryMethodStatObjItem,
  UnpayCategoryStatObjItem,
} from '@bgap/shared/types';
import { DateTime } from 'luxon';

export const calculatePaymentMethodSums = (
  paymentMethods: CrudApi.PaymentMethod[],
  orders: CrudApi.Order[],
) => {
  const paymentMethodSums: UnpayCategoryMethodStatObjItem = {};

  paymentMethods.forEach(method => {
    paymentMethodSums[method] = orders
      .filter(o => o.paymentMode.method === method)
      .reduce((prev, cur) => prev + cur.sumPriceShown.priceSum, 0);
  });

  return paymentMethodSums;
};

export const calculateUnpayCategoryStat = (
  category: CrudApi.UnpayCategory,
  orders: CrudApi.Order[],
  paymentMethods: CrudApi.PaymentMethod[],
): UnpayCategoryStatObjItem => {
  const categoryOrders = (orders || []).filter(
    o => o.unpayCategory === category,
  );

  const stat = {
    category,
    count: categoryOrders.length,
    sum: categoryOrders.reduce(
      (prev, cur) => prev + cur.sumPriceShown.priceSum,
      0,
    ),
    uniqueUsersCount: [...new Set(categoryOrders.map(o => o.userId))].length,
    paymentMethodSums: calculatePaymentMethodSums(
      paymentMethods,
      categoryOrders,
    ),
  };

  return stat;
};

export const getDailyOrdersSum = (
  dailyHistoryOrders: CrudApi.Order[],
): number => {
  let sum = 0;

  dailyHistoryOrders.forEach(o => {
    sum += o.sumPriceShown.priceSum;
  });

  return sum;
};

export const hourlyBreakdownOrderAmounts = (
  timeZone: string,
  products: CrudApi.GeneratedProduct[],
  orders: CrudApi.Order[],
): IOrderAmount => {
  const amounts: IOrderAmount = {
    [EProductType.DRINK]: new Array(24).fill(0),
    [EProductType.FOOD]: new Array(24).fill(0),
    [EProductType.OTHER]: new Array(24).fill(0),
    ordersCount: new Array(24).fill(0),
    sum: new Array(24).fill(0),
  };

  const productTypeMap: IKeyValueObject = {};
  products
    .filter(p => !!p.id)
    .forEach(p => {
      productTypeMap[p.id] = p.productType;
    });

  orders.forEach(o => {
    if (o.createdAt) {
      const date: DateTime = DateTime.fromISO(o.createdAt, { zone: timeZone });

      o.items
        ?.filter(i => productTypeMap[i.productId])
        .forEach((i: CrudApi.OrderItem) => {
          amounts[<EProductType>productTypeMap[i.productId]][date.hour] +=
            i.priceShown.priceSum;
          amounts['sum'][date.hour] += i.priceShown.priceSum;
        });

      amounts['ordersCount'][date.hour] += 1;
    }
  });

  return amounts;
};

export const dailySalesPerTypeOrderAmounts = (
  products: CrudApi.GeneratedProduct[],
  orders: CrudApi.Order[],
) => {
  const amounts: IOrderAmounts = {
    [EProductType.DRINK]: 0,
    [EProductType.FOOD]: 0,
    [EProductType.OTHER]: 0,
  };

  const productTypeMap: IKeyValueObject = {};
  products.forEach(p => {
    productTypeMap[p.id] = p.productType;
  });

  orders.forEach(o => {
    o.items.forEach(i => {
      amounts[<EProductType>productTypeMap[i.productId]] +=
        i.sumPriceShown.priceSum;
    });
  });

  return amounts;
};

export const dailySalesPerPaymentMethodOrderAmounts = (
  orders: CrudApi.Order[],
) => {
  const amounts: IOrderAmounts = {
    [CrudApi.PaymentMethod.card]: 0,
    [CrudApi.PaymentMethod.cash]: 0,
    [CrudApi.PaymentMethod.inapp]: 0,
  };

  orders.forEach(o => {
    amounts[o.paymentMode.method] += o.sumPriceShown.priceSum;
  });

  return amounts;
};
