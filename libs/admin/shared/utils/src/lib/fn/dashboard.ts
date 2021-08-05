import * as CrudApi from '@bgap/crud-gql/api';
import {
  EProductType,
  IKeyValueObject,
  IOrderAmount,
  IOrderAmounts,
  UnpayCategoryStatObjItem,
} from '@bgap/shared/types';

export const calculateUnpayCategoryStat = (
  category: CrudApi.UnpayCategory,
  categoryOrders: CrudApi.Order[],
): UnpayCategoryStatObjItem => {
  return {
    category,
    count: categoryOrders.length,
    sum: categoryOrders.reduce(
      (prev, cur) => prev + cur.sumPriceShown.priceSum,
      0,
    ),
    uniqueUsersCount: [...new Set(categoryOrders.map(o => o.userId))].length,
  };
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
    const hour = new Date(o.createdAt || 0).getHours();
    o.items
      ?.filter(i => productTypeMap[i.productId])
      .forEach((i: CrudApi.OrderItem) => {
        amounts[<EProductType>productTypeMap[i.productId]][hour] +=
          i.priceShown.priceSum;
        amounts['sum'][hour] += i.priceShown.priceSum;
      });

    amounts['ordersCount'][hour] += 1;
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
        i.priceShown.priceSum;
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
