import { pipe } from 'fp-ts/lib/function';

import {
  Maybe,
  Order,
  OrderItem,
  OrderStatus,
  PaymentStatus,
  PriceShown,
  StatusLog,
  UnpayCategory,
} from '@bgap/domain';

// Copypasted, as importing from @bgap/shared/utils results in an ugly
// circular dependency. shared types import types from crud api 🤷
const toFixed2Number = (value: string | number) =>
  Number(Number(value).toFixed(2));

const roundSums = (price: PriceShown) => {
  return {
    ...price,
    pricePerUnit: toFixed2Number(price.pricePerUnit),
    priceSum: toFixed2Number(price.priceSum),
    taxSum: toFixed2Number(price.taxSum),
  };
};

export const currentStatus = (status: Maybe<StatusLog>[]): OrderStatus => {
  if (!status || status.length === 0) {
    return OrderStatus.none;
  }
  const lastElement = status[status.length - 1];
  return lastElement?.status || OrderStatus.none;
};

export const getLowestStatus = (statuses: OrderStatus[]): OrderStatus => {
  const SORTED_ORDER_STATUSES = [
    OrderStatus.none,
    OrderStatus.placed,
    OrderStatus.processing,
    OrderStatus.ready,
    OrderStatus.served,
  ];

  const statusIndices: number[] = statuses
    .map((s: OrderStatus): number => SORTED_ORDER_STATUSES.indexOf(s))
    .filter((idx: number): boolean => idx >= 0);

  return SORTED_ORDER_STATUSES[Math.min(...statusIndices)];
};

export const getOrderStatusByItemsStatus = (orderItems: OrderItem[]) => {
  const itemsUniqueStatus = [
    ...new Set(orderItems.map(i => currentStatus(i.statusLog))),
  ];

  if (itemsUniqueStatus.every(i => i === OrderStatus.served)) {
    return OrderStatus.served;
  } else if (getLowestStatus(itemsUniqueStatus) === OrderStatus.ready) {
    return OrderStatus.ready;
  } else if (
    itemsUniqueStatus.some(i =>
      [OrderStatus.processing, OrderStatus.ready, OrderStatus.served].includes(
        i,
      ),
    )
  ) {
    return OrderStatus.processing;
  } else {
    return OrderStatus.placed;
  }
};

export const UNPAY_INCOME_CATEGORIES_ARR = [
  UnpayCategory.delivery,
  UnpayCategory.coupon,
  UnpayCategory.event,
];

export const UNPAY_NO_INCOME_CATEGORIES_ARR = [
  UnpayCategory.staff_meal,
  UnpayCategory.manager_meal,
  UnpayCategory.marketing_promo,
  UnpayCategory.error_cooked,
  UnpayCategory.error_no_cooked,
  UnpayCategory.payment_mode_change,
  UnpayCategory.other,
];

export const orderHasIncome = (order: Order) => {
  if (order.transactionStatus === PaymentStatus.success) {
    return true;
  } else if (order.transactionStatus === PaymentStatus.failed) {
    return (
      order.unpayCategory &&
      UNPAY_INCOME_CATEGORIES_ARR.includes(order.unpayCategory)
    );
  } else {
    return false;
  }
};

export const isRejectedOrder = (order: Order) => {
  return currentStatus(order.statusLog) === OrderStatus.rejected;
};

const sumItemConfigSetPrices = (item: OrderItem): number => {
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

export const calculateTaxSumFromBrutto = ({
  tax,
  brutto,
}: {
  tax: number;
  brutto: number;
}): number => (tax / 100 / (1 + tax / 100)) * brutto;

/**
 * With quantity multiplication
 */
const calculateItemPriceSumWithConfigSets = (item: OrderItem): number =>
  calculateItemUnitPriceWithConfigSets(item) * item.quantity;

/**
 * WithOUT quantity multiplication
 */
const calculateItemUnitPriceWithConfigSets = (item: OrderItem): number =>
  item.priceShown.pricePerUnit + sumItemConfigSetPrices(item);

const calculatePriceShown = (item: OrderItem): PriceShown => {
  return {
    tax: item.priceShown.tax,
    currency: item.priceShown.currency,
    pricePerUnit: item.priceShown.pricePerUnit,
    priceSum: item.priceShown.pricePerUnit * item.quantity,
    taxSum: calculateTaxSumFromBrutto({
      tax: item.priceShown.tax,
      brutto: item.priceShown.pricePerUnit * item.quantity,
    }),
  };
};

const calculateItemPriceShownWithConfigSets = (item: OrderItem): PriceShown => {
  const itemPriceSumWithConfigSetPrices =
    calculateItemPriceSumWithConfigSets(item);
  return {
    tax: item.priceShown.tax,
    currency: item.priceShown.currency,
    pricePerUnit: calculateItemUnitPriceWithConfigSets(item),
    priceSum: itemPriceSumWithConfigSetPrices,
    taxSum: calculateTaxSumFromBrutto({
      tax: item.priceShown.tax,
      brutto: itemPriceSumWithConfigSetPrices,
    }),
  };
};

const sumItems = (items: OrderItem[]): PriceShown => {
  const initValue: PriceShown = {
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

    if (lastStatus === OrderStatus.rejected) {
      return sum;
    }

    const itemPriceSumWithConfigSetPrices =
      calculateItemPriceSumWithConfigSets(item);
    const itemTaxSum = calculateTaxSumFromBrutto({
      tax: item.priceShown.tax,
      brutto: itemPriceSumWithConfigSetPrices,
    });
    return {
      priceSum: sum.priceSum + itemPriceSumWithConfigSetPrices,
      taxSum: sum.taxSum + itemTaxSum,
      currency: item.priceShown.currency,
      tax: 0,
      pricePerUnit: 0,
    };
  }, initValue);
};

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
export const calculateOrderSumPriceRounded = (items: OrderItem[]): PriceShown =>
  pipe(items, sumItems, roundSums);

/**
 * With ConfigSets
 *
 * @param item OrderItem
 * @returns a complete recalculate PriceShown object with added config set prices
 */
export const calculateOrderItemSumPriceRounded = (
  item: OrderItem,
): PriceShown => pipe(item, calculateItemPriceShownWithConfigSets, roundSums);

/**
 * Without ConfigSets
 *
 * @param item OrderItem
 * @returns a complete recalculate PriceShown object without config set prices
 */
export const calculateOrderItemPriceRounded = (item: OrderItem): PriceShown =>
  pipe(item, calculatePriceShown, roundSums);
