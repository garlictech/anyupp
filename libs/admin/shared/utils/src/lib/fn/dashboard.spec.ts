import * as CrudApi from '@bgap/crud-gql/api';
import { orderFixture as ofx } from '@bgap/shared/fixtures';

import { timezoneBudapest } from '../const';
import {
  calculatePaymentMethodSums,
  calculateProductMix,
  calculateUnpayCategoryStat,
  dailySalesPerPaymentMethodOrderAmounts,
  dailySalesPerTypeOrderAmounts,
  getDailyOrdersSum,
  hourlyBreakdownOrderAmounts,
  unpayCategoryTableData,
} from './dashboard';

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

const paymentMethods = [
  CrudApi.PaymentMethod.card,
  CrudApi.PaymentMethod.cash,
  CrudApi.PaymentMethod.inapp,
];

describe('Dashboard pure function tests', () => {
  describe('calculatePaymentMethodSums', () => {
    it('should calculate 1 item', () => {
      const result = calculatePaymentMethodSums(
        paymentMethods,
        failedHistoryOrders,
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('calculateUnpayCategoryStat', () => {
    it('should calculate 1 item', () => {
      const result = calculateUnpayCategoryStat(
        CrudApi.UnpayCategory.manager_meal,
        failedHistoryOrders,
        paymentMethods,
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('getDailyOrdersSum', () => {
    it('should calculate 1 item', () => {
      const result = getDailyOrdersSum(singleOrder);

      expect(result).toMatchSnapshot();
    });

    it('should calculate success history items', () => {
      const result = getDailyOrdersSum(successHistoryOrders);

      expect(result).toMatchSnapshot();
    });

    it('should calculate failed history items', () => {
      const result = getDailyOrdersSum(failedHistoryOrders);

      expect(result).toMatchSnapshot();
    });
  });

  describe('hourlyBreakdownOrderAmounts', () => {
    it('should calculate 1 item', () => {
      const result = hourlyBreakdownOrderAmounts(timezoneBudapest, singleOrder);

      expect(result).toMatchSnapshot();
    });

    it('should calculate success history items', () => {
      const result = hourlyBreakdownOrderAmounts(
        timezoneBudapest,
        successHistoryOrders,
      );

      expect(result).toMatchSnapshot();
    });

    it('should calculate failed history items', () => {
      const result = hourlyBreakdownOrderAmounts(
        timezoneBudapest,
        failedHistoryOrders,
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('dailySalesPerTypeOrderAmounts', () => {
    it('should calculate 1 item', () => {
      const result = dailySalesPerTypeOrderAmounts(singleOrder);

      expect(result).toMatchSnapshot();
    });

    it('should calculate success history items', () => {
      const result = dailySalesPerTypeOrderAmounts(successHistoryOrders);

      expect(result).toMatchSnapshot();
    });

    it('should calculate failed history items', () => {
      const result = dailySalesPerTypeOrderAmounts(failedHistoryOrders);

      expect(result).toMatchSnapshot();
    });
  });

  describe('dailySalesPerPaymentMethodOrderAmounts', () => {
    it('should calculate 1 item', () => {
      const result = dailySalesPerPaymentMethodOrderAmounts(singleOrder);

      expect(result).toMatchSnapshot();
    });

    it('should calculate success history items', () => {
      const result =
        dailySalesPerPaymentMethodOrderAmounts(successHistoryOrders);

      expect(result).toMatchSnapshot();
    });

    it('should calculate failed history items', () => {
      const result =
        dailySalesPerPaymentMethodOrderAmounts(failedHistoryOrders);

      expect(result).toMatchSnapshot();
    });
  });

  describe('calculateProductMix', () => {
    it('should calculate 1 item', () => {
      const result = calculateProductMix(singleOrder);

      expect(result).toMatchSnapshot();
    });

    it('should calculate lots of order items', () => {
      const result = calculateProductMix([
        ...successHistoryOrders,
        ...failedHistoryOrders,
      ]);

      expect(result).toMatchSnapshot();
    });
  });

  describe('unpayCategoryTableData', () => {
    it('should calculate hasIncome stats', () => {
      const result = unpayCategoryTableData(
        failedHistoryOrders,
        true,
        paymentMethods,
      );

      expect(result).toMatchSnapshot();
    });

    it('should calculate hasIncome stats', () => {
      const result = unpayCategoryTableData(
        failedHistoryOrders,
        false,
        paymentMethods,
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('unpayCategoryTableData', () => {
    it('should calculate hasIncome stats', () => {
      const result = unpayCategoryTableData(
        failedHistoryOrders,
        true,
        paymentMethods,
      );
      const expected = [
        {
          category: 'delivery',
          count: 2,
          paymentMethodSums: {
            card: 2982,
            cash: 2982,
            inapp: 0,
          },
          sum: 5964,
          uniqueUsersCount: 1,
        },
        {
          category: 'coupon',
          count: 2,
          paymentMethodSums: {
            card: 2982,
            cash: 2982,
            inapp: 0,
          },
          sum: 5964,
          uniqueUsersCount: 1,
        },
        {
          category: 'event',
          count: 2,
          paymentMethodSums: {
            card: 2982,
            cash: 2982,
            inapp: 0,
          },
          sum: 5964,
          uniqueUsersCount: 1,
        },
        {
          category: 'sum',
          count: 6,
          paymentMethodSums: {
            card: 8946,
            cash: 8946,
            inapp: 0,
          },
          sum: 17892,
          uniqueUsersCount: 1,
        },
      ];
      expect(result).toEqual(expected);
    });

    it('should calculate hasIncome stats', () => {
      const result = unpayCategoryTableData(
        failedHistoryOrders,
        false,
        paymentMethods,
      );
      const expected = [
        {
          category: 'staff_meal',
          count: 2,
          paymentMethodSums: {
            card: 2982,
            cash: 2982,
            inapp: 0,
          },
          sum: 5964,
          uniqueUsersCount: 1,
        },
        {
          category: 'manager_meal',
          count: 2,
          paymentMethodSums: {
            card: 2982,
            cash: 2982,
            inapp: 0,
          },
          sum: 5964,
          uniqueUsersCount: 1,
        },
        {
          category: 'marketing_promo',
          count: 2,
          paymentMethodSums: {
            card: 2982,
            cash: 2982,
            inapp: 0,
          },
          sum: 5964,
          uniqueUsersCount: 1,
        },
        {
          category: 'error_cooked',
          count: 2,
          paymentMethodSums: {
            card: 2982,
            cash: 2982,
            inapp: 0,
          },
          sum: 5964,
          uniqueUsersCount: 1,
        },
        {
          category: 'error_no_cooked',
          count: 2,
          paymentMethodSums: {
            card: 2982,
            cash: 2982,
            inapp: 0,
          },
          sum: 5964,
          uniqueUsersCount: 1,
        },
        {
          category: 'payment_mode_change',
          count: 2,
          paymentMethodSums: {
            card: 2982,
            cash: 2982,
            inapp: 0,
          },
          sum: 5964,
          uniqueUsersCount: 1,
        },
        {
          category: 'other',
          count: 2,
          paymentMethodSums: {
            card: 2982,
            cash: 2982,
            inapp: 0,
          },
          sum: 5964,
          uniqueUsersCount: 1,
        },
        {
          category: 'sum',
          count: 14,
          paymentMethodSums: {
            card: 20874,
            cash: 20874,
            inapp: 0,
          },
          sum: 41748,
          uniqueUsersCount: 1,
        },
      ];
      expect(result).toEqual(expected);
    });
  });
});
