import * as CrudApi from '@bgap/crud-gql/api';
import {
  orderFixture as ofx,
  generatedProductFixture as gpfx,
  testIdPrefix,
} from '@bgap/shared/fixtures';

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

const products: CrudApi.GeneratedProduct[] = [
  {
    ...gpfx.generatedDrinkProduct,
    id: `${testIdPrefix}unit_product_fanta`,
  },
  {
    ...gpfx.generatedFoodProduct,
    id: `${testIdPrefix}unit_product_hamburger`,
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
      const result = hourlyBreakdownOrderAmounts(
        timezoneBudapest,
        products,
        singleOrder,
      );

      expect(result).toMatchSnapshot();
    });

    it('should calculate success history items', () => {
      const result = hourlyBreakdownOrderAmounts(
        timezoneBudapest,
        products,
        successHistoryOrders,
      );

      expect(result).toMatchSnapshot();
    });

    it('should calculate failed history items', () => {
      const result = hourlyBreakdownOrderAmounts(
        timezoneBudapest,
        products,
        failedHistoryOrders,
      );

      expect(result).toMatchSnapshot();
    });
  });

  describe('dailySalesPerTypeOrderAmounts', () => {
    it('should calculate 1 item', () => {
      const result = dailySalesPerTypeOrderAmounts(products, singleOrder);

      expect(result).toMatchSnapshot();
    });

    it('should calculate success history items', () => {
      const result = dailySalesPerTypeOrderAmounts(
        products,
        successHistoryOrders,
      );

      expect(result).toMatchSnapshot();
    });

    it('should calculate failed history items', () => {
      const result = dailySalesPerTypeOrderAmounts(
        products,
        failedHistoryOrders,
      );

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
      const result = calculateProductMix(singleOrder, products);

      expect(result).toMatchSnapshot();
    });

    it('should calculate lots of order items', () => {
      const result = calculateProductMix(
        [...successHistoryOrders, ...failedHistoryOrders],
        products,
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
});
