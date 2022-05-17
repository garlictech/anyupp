import { pipe } from 'fp-ts/function';
import * as CrudApi from '../generated/api';

// Copypasted, as importing from @bgap/shared/utils results in an ugly
// circular dependency. shared types import types from crud api 🤷
const toFixed2Number = (value: string | number) =>
  Number(Number(value).toFixed(2));

const roundSums = (price: CrudApi.PriceShown) => {
  return {
    ...price,
    pricePerUnit: toFixed2Number(price.pricePerUnit),
    priceSum: toFixed2Number(price.priceSum),
    taxSum: toFixed2Number(price.taxSum),
  };
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

export const getLowestStatus = (
  statuses: CrudApi.OrderStatus[],
): CrudApi.OrderStatus => {
  const SORTED_ORDER_STATUSES = [
    CrudApi.OrderStatus.none,
    CrudApi.OrderStatus.placed,
    CrudApi.OrderStatus.processing,
    CrudApi.OrderStatus.ready,
    CrudApi.OrderStatus.served,
  ];

  const statusIndices: number[] = statuses
    .map((s: CrudApi.OrderStatus): number => SORTED_ORDER_STATUSES.indexOf(s))
    .filter((idx: number): boolean => idx >= 0);

  return SORTED_ORDER_STATUSES[Math.min(...statusIndices)];
};

export const getOrderStatusByItemsStatus = (
  orderItems: CrudApi.OrderItem[],
) => {
  const itemsUniqueStatus = [
    ...new Set(orderItems.map(i => currentStatus(i.statusLog))),
  ];

  if (itemsUniqueStatus.every(i => i === CrudApi.OrderStatus.served)) {
    return CrudApi.OrderStatus.served;
  } else if (getLowestStatus(itemsUniqueStatus) === CrudApi.OrderStatus.ready) {
    return CrudApi.OrderStatus.ready;
  } else if (
    itemsUniqueStatus.some(i =>
      [
        CrudApi.OrderStatus.processing,
        CrudApi.OrderStatus.ready,
        CrudApi.OrderStatus.served,
      ].includes(i),
    )
  ) {
    return CrudApi.OrderStatus.processing;
  } else {
    return CrudApi.OrderStatus.placed;
  }
};

export const UNPAY_INCOME_CATEGORIES_ARR = [
  CrudApi.UnpayCategory.delivery,
  CrudApi.UnpayCategory.coupon,
  CrudApi.UnpayCategory.event,
];

export const UNPAY_NO_INCOME_CATEGORIES_ARR = [
  CrudApi.UnpayCategory.staff_meal,
  CrudApi.UnpayCategory.manager_meal,
  CrudApi.UnpayCategory.marketing_promo,
  CrudApi.UnpayCategory.error_cooked,
  CrudApi.UnpayCategory.error_no_cooked,
  CrudApi.UnpayCategory.payment_mode_change,
  CrudApi.UnpayCategory.other,
];

export const orderHasIncome = (order: CrudApi.Order) => {
  if (order.transactionStatus === CrudApi.PaymentStatus.success) {
    return true;
  } else if (order.transactionStatus === CrudApi.PaymentStatus.failed) {
    return (
      order.unpayCategory &&
      UNPAY_INCOME_CATEGORIES_ARR.includes(order.unpayCategory)
    );
  } else {
    return false;
  }
};

export const isRejectedOrder = (order: CrudApi.Order) => {
  return currentStatus(order.statusLog) === CrudApi.OrderStatus.rejected;
};

const sumItemConfigSetPrices = (item: CrudApi.OrderItem): number => {
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
const calculateItemPriceSumWithConfigSets = (item: CrudApi.OrderItem): number =>
  calculateItemUnitPriceWithConfigSets(item) * item.quantity;

/**
 * WithOUT quantity multiplication
 */
const calculateItemUnitPriceWithConfigSets = (
  item: CrudApi.OrderItem,
): number => item.priceShown.pricePerUnit + sumItemConfigSetPrices(item);

const calculatePriceShown = (item: CrudApi.OrderItem): CrudApi.PriceShown => {
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

const calculateItemPriceShownWithConfigSets = (
  item: CrudApi.OrderItem,
): CrudApi.PriceShown => {
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

const sumItems = (items: CrudApi.OrderItem[]): CrudApi.PriceShown => {
  const initValue: CrudApi.PriceShown = {
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

    if (lastStatus === CrudApi.OrderStatus.rejected) {
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
export const calculateOrderSumPriceRounded = (
  items: CrudApi.OrderItem[],
): CrudApi.PriceShown => pipe(items, sumItems, roundSums);

/**
 * With ConfigSets
 *
 * @param item OrderItem
 * @returns a complete recalculate PriceShown object with added config set prices
 */
export const calculateOrderItemSumPriceRounded = (
  item: CrudApi.OrderItem,
): CrudApi.PriceShown =>
  pipe(item, calculateItemPriceShownWithConfigSets, roundSums);

/**
 * Without ConfigSets
 *
 * @param item OrderItem
 * @returns a complete recalculate PriceShown object without config set prices
 */
export const calculateOrderItemPriceRounded = (
  item: CrudApi.OrderItem,
): CrudApi.PriceShown => pipe(item, calculatePriceShown, roundSums);
