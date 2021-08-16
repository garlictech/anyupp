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
      const expected = {
        card: 29820,
        cash: 29820,
        inapp: 0,
      };

      expect(result).toEqual(expected);
    });
  });

  describe('calculateUnpayCategoryStat', () => {
    it('should calculate 1 item', () => {
      const result = calculateUnpayCategoryStat(
        CrudApi.UnpayCategory.manager_meal,
        failedHistoryOrders,
        paymentMethods,
      );
      const expected = {
        category: 'manager_meal',
        count: 2,
        paymentMethodSums: {
          card: 2982,
          cash: 2982,
          inapp: 0,
        },
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

  describe('calculateProductMix', () => {
    it('should calculate 1 item', () => {
      const result = calculateProductMix(singleOrder, products);
      const expected = [
        {
          components: [
            {
              componentId: 'test_product_component_id',
              name: {
                de: 'Room temperature',
                en: 'Room temperature',
                hu: 'Szobahőmérsékletű',
              },
              quantity: 5,
            },
          ],
          name: { de: null, en: 'Hamburger', hu: 'Hamburger' },
          productId: 'test_unit_product_hamburger',
          productType: 'food',
          quantity: 5,
          variants: [
            {
              name: { de: null, en: 'glass', hu: 'pohár' },
              quantity: 5,
              variantId: 'test_variant_id',
            },
          ],
        },
        {
          components: [
            {
              componentId: 'test_product_component_id',
              name: {
                de: 'Room temperature',
                en: 'Room temperature',
                hu: 'Szobahőmérsékletű',
              },
              quantity: 5,
            },
          ],
          name: { de: null, en: 'Fanta', hu: 'Fanta' },
          productId: 'test_unit_product_fanta',
          productType: 'drink',
          quantity: 5,
          variants: [
            {
              name: { de: null, en: 'glass', hu: 'pohár' },
              quantity: 5,
              variantId: 'test_variant_id',
            },
          ],
        },
      ];

      expect(result).toEqual(expected);
    });

    it('should calculate lots of order items', () => {
      const result = calculateProductMix(
        [...successHistoryOrders, ...failedHistoryOrders],
        products,
      );
      const expected = [
        {
          components: [
            {
              componentId: 'test_product_component_id',
              name: {
                de: 'Room temperature',
                en: 'Room temperature',
                hu: 'Szobahőmérsékletű',
              },
              quantity: 115,
            },
          ],
          name: { de: null, en: 'Hamburger', hu: 'Hamburger' },
          productId: 'test_unit_product_hamburger',
          productType: 'food',
          quantity: 115,
          variants: [
            {
              name: { de: null, en: 'glass', hu: 'pohár' },
              quantity: 115,
              variantId: 'test_variant_id',
            },
          ],
        },
        {
          components: [
            {
              componentId: 'test_product_component_id',
              name: {
                de: 'Room temperature',
                en: 'Room temperature',
                hu: 'Szobahőmérsékletű',
              },
              quantity: 115,
            },
          ],
          name: { de: null, en: 'Fanta', hu: 'Fanta' },
          productId: 'test_unit_product_fanta',
          productType: 'drink',
          quantity: 115,
          variants: [
            {
              name: { de: null, en: 'glass', hu: 'pohár' },
              quantity: 115,
              variantId: 'test_variant_id',
            },
          ],
        },
      ];

      expect(result).toEqual(expected);
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
