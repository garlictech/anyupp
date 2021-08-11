import * as CrudApi from '@bgap/crud-gql/api';
import {
  orderFixture as ofx,
  generatedProductFixture as gpfx,
  testIdPrefix,
} from '@bgap/shared/fixtures';

import {
  calculateUnpayCategoryStat,
  dailySalesPerPaymentMethodOrderAmounts,
  dailySalesPerTypeOrderAmounts,
  getDailyOrdersSum,
  hourlyBreakdownOrderAmounts,
} from './dashboard';

const products: CrudApi.GeneratedProduct[] = [
  {
    ...gpfx.generatedDrinkProduct,
    id: `${testIdPrefix}_unit_product_fanta`,
  },
  {
    ...gpfx.generatedFoodProduct,
    id: `${testIdPrefix}_unit_product_hamburger`,
  },
];
const timezoneBudapest = 'Europe/Budapest';
const singleOrder = [ofx.convertInputToOrder(ofx.historySuccessCardOrderInput)];
const successHistoryOrders = [
  ofx.convertInputToOrder(ofx.historySuccessCardOrderInput),
  ofx.convertInputToOrder(ofx.historySuccessCashOrderInput),
  ofx.convertInputToOrder(ofx.historySuccessStripeOrderInput),
];
const failedHistoryOrders = [
  ofx.convertInputToOrder(ofx.historyFailedCardStaffMealOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCardManagerMealOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCardMarketingPromoOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCardErrorCookedOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCardErrorNoCookedOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCardPaymentModeChangedOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCardOtherOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCardDeliveryOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCardCouponOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCardEventOrderInput),

  ofx.convertInputToOrder(ofx.historyFailedCashStaffMealOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCashManagerMealOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCashMarketingPromoOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCashErrorCookedOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCashErrorNoCookedOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCashPaymentModeChangedOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCashOtherOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCashDeliveryOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCashCouponOrderInput),
  ofx.convertInputToOrder(ofx.historyFailedCashEventOrderInput),
];

describe('Dashboard pure function tests', () => {
  describe('calculateUnpayCategoryStat', () => {
    it('should calculate 1 item', () => {
      const result = calculateUnpayCategoryStat(
        CrudApi.UnpayCategory.manager_meal,
        failedHistoryOrders,
      );
      const expected = {
        category: 'manager_meal',
        count: 2,
        sum: 5964,
        uniqueUsersCount: 1,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('getDailyOrdersSum', () => {
    it('should calculate 1 item', () => {
      const result = getDailyOrdersSum(singleOrder);
      const expected = 2982;

      expect(result).toEqual(expected);
    });

    it('should calculate success history items', () => {
      const result = getDailyOrdersSum(successHistoryOrders);
      const expected = 8946;

      expect(result).toEqual(expected);
    });

    it('should calculate failed history items', () => {
      const result = getDailyOrdersSum(failedHistoryOrders);
      const expected = 59640;

      expect(result).toEqual(expected);
    });
  });

  describe('hourlyBreakdownOrderAmounts', () => {
    it('should calculate 1 item', () => {
      const result = hourlyBreakdownOrderAmounts(
        timezoneBudapest,
        products,
        singleOrder,
      );
      const expected = {
        drink: [
          0, 0, 0, 1500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0,
        ],
        food: [
          0, 0, 0, 1500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0,
        ],
        ordersCount: [
          0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0,
        ],
        other: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0,
        ],
        sum: [
          0, 0, 0, 3000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0,
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should calculate success history items', () => {
      const result = hourlyBreakdownOrderAmounts(
        timezoneBudapest,
        products,
        successHistoryOrders,
      );
      const expected = {
        drink: [
          0, 0, 0, 4500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0,
        ],
        food: [
          0, 0, 0, 4500, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0,
        ],
        ordersCount: [
          0, 0, 0, 3, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0,
        ],
        other: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0,
        ],
        sum: [
          0, 0, 0, 9000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0,
        ],
      };

      expect(result).toEqual(expected);
    });

    it('should calculate failed history items', () => {
      const result = hourlyBreakdownOrderAmounts(
        timezoneBudapest,
        products,
        failedHistoryOrders,
      );
      const expected = {
        drink: [
          0, 0, 0, 30000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0,
        ],
        food: [
          0, 0, 0, 30000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0,
        ],
        ordersCount: [
          0, 0, 0, 20, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0,
        ],
        other: [
          0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0,
        ],
        sum: [
          0, 0, 0, 60000, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
          0, 0,
        ],
      };

      expect(result).toEqual(expected);
    });
  });

  describe('dailySalesPerTypeOrderAmounts', () => {
    it('should calculate 1 item', () => {
      const result = dailySalesPerTypeOrderAmounts(products, singleOrder);
      const expected = { drink: 1491, food: 1491, other: 0 };

      expect(result).toEqual(expected);
    });

    it('should calculate success history items', () => {
      const result = dailySalesPerTypeOrderAmounts(
        products,
        successHistoryOrders,
      );
      const expected = { drink: 4473, food: 4473, other: 0 };

      expect(result).toEqual(expected);
    });

    it('should calculate failed history items', () => {
      const result = dailySalesPerTypeOrderAmounts(
        products,
        failedHistoryOrders,
      );
      const expected = { drink: 29820, food: 29820, other: 0 };

      expect(result).toEqual(expected);
    });
  });

  describe('dailySalesPerPaymentMethodOrderAmounts', () => {
    it('should calculate 1 item', () => {
      const result = dailySalesPerPaymentMethodOrderAmounts(singleOrder);
      const expected = { card: 2982, cash: 0, inapp: 0 };

      expect(result).toEqual(expected);
    });

    it('should calculate success history items', () => {
      const result =
        dailySalesPerPaymentMethodOrderAmounts(successHistoryOrders);
      const expected = { card: 2982, cash: 2982, inapp: 2982 };

      expect(result).toEqual(expected);
    });

    it('should calculate failed history items', () => {
      const result =
        dailySalesPerPaymentMethodOrderAmounts(failedHistoryOrders);
      const expected = { card: 29820, cash: 29820, inapp: 0 };

      expect(result).toEqual(expected);
    });
  });
});
