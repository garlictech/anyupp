import { DateTime } from 'luxon';

import {
  UNPAY_INCOME_CATEGORIES_ARR,
  UNPAY_NO_INCOME_CATEGORIES_ARR,
} from '@bgap/crud-gql/api';
import {
  Order,
  OrderItem,
  PaymentMethod,
  PaymentMode,
  ProductType,
  UnpayCategory,
} from '@bgap/domain';
import {
  OrderAmount,
  OrderAmounts,
  ProducMixObject,
  ProducMixObjectInfo,
  TIP_KEY,
  UnpayCategoryMethodStatObjItem,
  UnpayCategoryStatObj,
  UnpayCategoryStatObjItem,
} from '@bgap/shared/types';

const UNKNOWN_PRODUCT_TYPE = 'unknown';

export const calculatePaymentMethodSums = (
  paymentMethods: PaymentMethod[],
  orders: Order[],
) => {
  const paymentMethodSums: UnpayCategoryMethodStatObjItem = {};

  paymentMethods.forEach(method => {
    paymentMethodSums[method] = orders
      .filter(o => o.paymentMode?.method === method)
      .reduce((prev, cur) => prev + cur.sumPriceShown.priceSum, 0);
  });

  return paymentMethodSums;
};

export const calculateUnpayCategoryStat = (
  category: UnpayCategory,
  orders: Order[],
  paymentMethods: PaymentMethod[],
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

export const getDailyOrdersSum = (dailyHistoryOrders: Order[]): number => {
  let sum = 0;

  dailyHistoryOrders.forEach(o => {
    sum += o.sumPriceShown.priceSum;
  });

  return sum;
};

export const hourlyBreakdownOrderAmounts = (
  timeZone: string,
  orders: Order[],
): OrderAmount => {
  const amounts: OrderAmount = {
    [ProductType.drink]: new Array(24).fill(0),
    [ProductType.food]: new Array(24).fill(0),
    [ProductType.other]: new Array(24).fill(0),
    [TIP_KEY]: new Array(24).fill(0),
    ordersCount: new Array(24).fill(0),
    sum: new Array(24).fill(0),
  };

  orders.forEach(o => {
    if (o.createdAt) {
      const date: DateTime = DateTime.fromISO(o.createdAt, { zone: timeZone });

      o.items?.forEach((i: OrderItem) => {
        amounts[i.productType || UNKNOWN_PRODUCT_TYPE][date.hour] +=
          i.priceShown.priceSum;
        amounts['sum'][date.hour] += i.priceShown.priceSum;
      });
      amounts[TIP_KEY][date.hour] += o.tipTransaction?.total || 0;

      amounts['ordersCount'][date.hour] += 1;
    }
  });

  return amounts;
};

export const dailySalesPerTypeOrderAmounts = (orders: Order[]) => {
  const amounts: OrderAmounts = {
    [ProductType.drink]: 0,
    [ProductType.food]: 0,
    [ProductType.other]: 0,
    [TIP_KEY]: 0,
  };

  orders.forEach(o => {
    o.items.forEach(i => {
      amounts[i.productType || UNKNOWN_PRODUCT_TYPE] +=
        i.sumPriceShown.priceSum;
    });
    amounts[TIP_KEY] += o.tipTransaction?.total || 0;
  });

  return amounts;
};

export const dailySalesPerPaymentMethodOrderAmounts = (orders: Order[]) => {
  const amounts: OrderAmounts = {
    [PaymentMethod.card]: 0,
    [PaymentMethod.cash]: 0,
    [PaymentMethod.inapp]: 0,
  };

  orders
    .filter(o => !!o.paymentMode)
    .forEach(o => {
      amounts[(<PaymentMode>o.paymentMode).method] += o.sumPriceShown.priceSum;
    });

  return amounts;
};

export const calculateProductMix = (orders: Order[]) => {
  const productMix: ProducMixObject = {};

  orders.forEach(order => {
    order.items.forEach(orderItem => {
      if (!productMix[orderItem.productId]) {
        productMix[orderItem.productId] = {
          productId: orderItem.productId,
          productType: orderItem.productType || UNKNOWN_PRODUCT_TYPE,
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

  const sorter = (a: ProducMixObjectInfo, b: ProducMixObjectInfo) =>
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
  orders: Order[],
  hasIncome: boolean,
  paymentMethods: PaymentMethod[],
) => {
  const unpayCategoryStatObj: UnpayCategoryStatObj = {};

  const incomeFilteredOrders: Order[] = orders.filter(
    o =>
      o.unpayCategory &&
      (hasIncome
        ? UNPAY_INCOME_CATEGORIES_ARR
        : UNPAY_NO_INCOME_CATEGORIES_ARR
      ).includes(o.unpayCategory),
  );

  (hasIncome
    ? UNPAY_INCOME_CATEGORIES_ARR
    : UNPAY_NO_INCOME_CATEGORIES_ARR
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
