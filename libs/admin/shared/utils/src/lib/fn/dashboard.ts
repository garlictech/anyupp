import { DateTime } from 'luxon';

import * as CrudApi from '@bgap/crud-gql/api';
import {
  UNPAY_INCOME_CATEGORIES_ARR,
  UNPAY_NO_INCOME_CATEGORIES_ARR,
} from '@bgap/crud-gql/api';
import {
  EProductType,
  IKeyValueObject,
  IOrderAmount,
  IOrderAmounts,
  IProducMixObject,
  IProducMixObjectInfo,
  UnpayCategoryMethodStatObjItem,
  UnpayCategoryStatObj,
  UnpayCategoryStatObjItem,
} from '@bgap/shared/types';

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

export const calculateProductMix = (
  orders: CrudApi.Order[],
  products: CrudApi.GeneratedProduct[],
) => {
  const productMix: IProducMixObject = {};

  const productTypeMap: IKeyValueObject = {};
  products.forEach(p => {
    productTypeMap[p.id] = p.productType;
  });

  orders.forEach(order => {
    order.items.forEach(orderItem => {
      if (!productMix[orderItem.productId]) {
        productMix[orderItem.productId] = {
          productId: orderItem.productId,
          productType: productTypeMap[orderItem.productId],
          quantity: 0,
          name: orderItem.productName,
          variants: {},
          components: {},
        };
      }

      productMix[orderItem.productId].quantity += orderItem.quantity;

      //
      // Variants
      //

      if (!productMix[orderItem.productId].variants[orderItem.variantId]) {
        productMix[orderItem.productId].variants[orderItem.variantId] = {
          variantId: orderItem.variantId,
          quantity: 0,
          name: orderItem.variantName,
        };
      }

      productMix[orderItem.productId].variants[orderItem.variantId].quantity +=
        orderItem.quantity;

      //
      // Modifiers & Extras
      //

      if (orderItem.configSets) {
        orderItem.configSets.forEach(configSet => {
          configSet.items.forEach(component => {
            if (
              !productMix[orderItem.productId].components[
                component.productComponentId
              ]
            ) {
              productMix[orderItem.productId].components[
                component.productComponentId
              ] = {
                componentId: component.productComponentId,
                quantity: 0,
                name: component.name,
              };
            }

            productMix[orderItem.productId].components[
              component.productComponentId
            ].quantity += orderItem.quantity;
          });
        });
      }
    });
  });

  const sorter = (a: IProducMixObjectInfo, b: IProducMixObjectInfo) =>
    a.quantity > b.quantity ? -1 : 1;

  return Object.values(productMix)
    .map(p => ({
      ...p,
      variants: Object.values(p.variants).sort(sorter),
      components: Object.values(p.components).sort(sorter),
    }))
    .sort(sorter);
};

export const unpayCategoryTableData = (
  orders: CrudApi.Order[],
  hasIncome: boolean,
  paymentMethods: CrudApi.PaymentMethod[],
) => {
  const unpayCategoryStatObj: UnpayCategoryStatObj = {};

  const incomeFilteredOrders: CrudApi.Order[] = orders.filter(
    o =>
      o.unpayCategory &&
      (hasIncome
        ? CrudApi.UNPAY_INCOME_CATEGORIES_ARR
        : CrudApi.UNPAY_NO_INCOME_CATEGORIES_ARR
      ).includes(o.unpayCategory),
  );

  (hasIncome
    ? CrudApi.UNPAY_INCOME_CATEGORIES_ARR
    : CrudApi.UNPAY_NO_INCOME_CATEGORIES_ARR
  ).forEach(category => {
    unpayCategoryStatObj[category] = calculateUnpayCategoryStat(
      category,
      orders,
      paymentMethods,
    );
  });

  unpayCategoryStatObj['sum'] = {
    category: 'sum',
    count: Object.values(unpayCategoryStatObj).reduce(
      (prev, cur) => prev + cur.count,
      0,
    ),
    sum: Object.values(unpayCategoryStatObj).reduce(
      (prev, cur) => prev + cur.sum,
      0,
    ),
    paymentMethodSums: calculatePaymentMethodSums(
      paymentMethods,
      incomeFilteredOrders,
    ),
    uniqueUsersCount: [...new Set(incomeFilteredOrders.map(o => o.userId))]
      .length,
  };

  return Object.values(unpayCategoryStatObj);
};
