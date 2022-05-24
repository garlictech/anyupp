import * as CrudApi from '@bgap/crud-gql/api';
import { orderFixtureBase as ofx } from '@bgap/shared/fixtures';
import { timezoneBudapest } from '@bgap/shared/utils';

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
import * as dfx from './dashboard.fixtures';

const singleOrder = [ofx.convertInputToOrder(dfx.historySuccessCardOrderInput)];
const successHistoryOrders = [
  ofx.convertInputToOrder(dfx.historySuccessCardOrderInput),
  ofx.convertInputToOrder(dfx.historySuccessCashOrderInput),
  ofx.convertInputToOrder(dfx.historySuccessStripeOrderInput),
];
const failedHistoryOrders = [
  ofx.convertInputToOrder(dfx.historyFailedCardStaffMealOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCardManagerMealOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCardMarketingPromoOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCardErrorCookedOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCardErrorNoCookedOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCardPaymentModeChangedOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCardOtherOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCardDeliveryOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCardCouponOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCardEventOrderInput),

  ofx.convertInputToOrder(dfx.historyFailedCashStaffMealOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCashManagerMealOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCashMarketingPromoOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCashErrorCookedOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCashErrorNoCookedOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCashPaymentModeChangedOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCashOtherOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCashDeliveryOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCashCouponOrderInput),
  ofx.convertInputToOrder(dfx.historyFailedCashEventOrderInput),
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
