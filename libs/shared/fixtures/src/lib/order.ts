import * as CrudApi from '@bgap/crud-gql/api';
import { EProductType, SORTED_ORDER_STATUSES } from '@bgap/shared/types';
import { productSnapshotFixture } from './product-snapshot';
import { seededIdPrefix, testIdPrefix } from './common';
import { unitFixture } from './unit';

const order_seeded_01_id = `${seededIdPrefix}order_1_id`;

const orderItemInputBase = (
  productFixture: CrudApi.CreateChainProductInput,
) => ({
  quantity: 5,
  productId: productFixture.id || '',
  statusLog: [
    {
      userId: 'test-monad',
      status: CrudApi.OrderStatus.none,
      ts: 1627909024677,
    },
  ],
  sumPriceShown: {
    taxSum: 316.98,
    currency: 'HUF',
    tax: 27,
    priceSum: 1491,
    pricePerUnit: 298.2,
  },
  productName: productFixture.name,
  allergens: productFixture.allergens,
  laneId: `lane_01`,
  priceShown: {
    taxSum: 318.9,
    currency: 'HUF',
    tax: 27,
    priceSum: 1500,
    pricePerUnit: 300,
  },
  variantId: productFixture.variants?.[0]?.id || '',
  variantName: productFixture.variants?.[0]?.variantName || {
    en: 'unused',
    hu: 'unused',
    de: 'unused',
  },
  configSets: [
    {
      name: {
        de: null as string | null,
        en: 'Modifier comp set',
        hu: 'Módosító komponens set',
      },
      type: 'modifier',
      items: [
        {
          productComponentId: `${testIdPrefix}product_component_id`,
          name: {
            de: 'Room temperature',
            en: 'Room temperature',
            hu: 'Szobahőmérsékletű',
          },
          price: -1.7999999999999998,
          allergens: [CrudApi.Allergen.egg, CrudApi.Allergen.gluten],
        },
      ],
      productSetId: `${testIdPrefix}product_component_set_id`,
    },
  ],
  productType: EProductType.DRINK,
});

const orderInputBase = {
  userId: 'test-monad',
  unitId: unitFixture.unitId_seeded_01,
  items: [
    orderItemInputBase(productSnapshotFixture.chainProduct_1),
    orderItemInputBase(productSnapshotFixture.chainProduct_2),
    orderItemInputBase(productSnapshotFixture.chainProduct_3),
  ],
  sumPriceShown: {
    taxSum: 633.96,
    currency: 'HUF',
    tax: 27,
    priceSum: 2982,
    pricePerUnit: 298.2,
  },
  takeAway: false,
  place: {
    table: '01',
    seat: '01',
  },
  orderMode: CrudApi.OrderMode.instant,
  servingMode: CrudApi.ServingMode.inplace,
  hasRated: true,
  rating: {
    key: 'RATING KEY',
    value: 3,
  },
  serviceFee: {
    currency: 'HUF',
    grossPrice: 200,
    taxContent: 20,
  },
};

const cardPayment = {
  paymentMode: {
    type: CrudApi.PaymentType.card,
    method: CrudApi.PaymentMethod.card,
  },
};

const cashPayment = {
  paymentMode: {
    type: CrudApi.PaymentType.cash,
    method: CrudApi.PaymentMethod.cash,
  },
};

const stripePayment = {
  paymentMode: {
    type: CrudApi.PaymentType.stripe,
    method: CrudApi.PaymentMethod.inapp,
  },
};

const getOrderStatusLogItem = (status: CrudApi.OrderStatus) => ({
  userId: 'test-alice',
  status,
  ts: 1627909024677,
});

const getOrderStatusLog = (status: CrudApi.OrderStatus) => ({
  statusLog: [getOrderStatusLogItem(status)],
});

const generateOrderItemStatusHistory = (status: CrudApi.OrderStatus) => {
  const statusIdx = SORTED_ORDER_STATUSES.indexOf(status);
  const statusArray: CrudApi.StatusLog[] = [];

  if (statusIdx >= 0) {
    for (let i = 0; i <= statusIdx; i++) {
      statusArray.push(getOrderStatusLogItem(SORTED_ORDER_STATUSES[i]));
    }
  }

  return statusArray;
};

// Assign a main and item status history to an order
const buildOrderStatusHistory = (
  order: CrudApi.CreateOrderInput,
  status: CrudApi.OrderStatus,
) => {
  // Copy base data
  const filledOrder = {
    ...order,
    ...getOrderStatusLog(status),
  };

  // Update order items
  order.items.forEach(orderItem => {
    orderItem.statusLog = generateOrderItemStatusHistory(status);
  });

  return filledOrder;
};

const waitingTransaction = {
  transactionStatus: CrudApi.PaymentStatus.waiting_for_payment,
};

const successfullTransaction = {
  transactionStatus: CrudApi.PaymentStatus.success,
};

const getFailedTransaction = (unpayCategory: CrudApi.UnpayCategory) => ({
  transactionStatus: CrudApi.PaymentStatus.failed,
  unpayCategory,
});

const activeOrderInputBase = {
  ...orderInputBase,
  ...getOrderStatusLog(CrudApi.OrderStatus.none),
  orderNum: '000000',
  archived: false,
};

const historyOrderInputBase = {
  ...orderInputBase,
  ...getOrderStatusLog(CrudApi.OrderStatus.served),
  orderNum: '000000',
  archived: true,
};

const activeWaitingCardOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...cardPayment,
  ...waitingTransaction,
};

const activeWaitingCashOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...cashPayment,
  ...waitingTransaction,
};

const activeWaitingStripeOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...stripePayment,
  ...waitingTransaction,
};

const activeWaitingAfterPayOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...waitingTransaction,
};

const activeWaitingPlacedCardOrderInput: CrudApi.CreateOrderInput = {
  ...buildOrderStatusHistory(
    {
      ...activeOrderInputBase,
      ...cardPayment,
    },
    CrudApi.OrderStatus.placed,
  ),
  ...waitingTransaction,
};

const activeSuccessPlacedCashOrderInput: CrudApi.CreateOrderInput = {
  ...buildOrderStatusHistory(
    {
      ...activeOrderInputBase,
      ...cashPayment,
    },
    CrudApi.OrderStatus.placed,
  ),
  ...successfullTransaction,
};

const activeSuccessCardOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...cardPayment,
  ...successfullTransaction,
  ...getOrderStatusLog(CrudApi.OrderStatus.placed),
};

const activeSuccessCashOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...cashPayment,
  ...successfullTransaction,
  ...getOrderStatusLog(CrudApi.OrderStatus.placed),
};

const activeServedSuccessCardOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...cardPayment,
  ...successfullTransaction,
  ...getOrderStatusLog(CrudApi.OrderStatus.served),
};

const activeServedSuccessCashOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...cashPayment,
  ...successfullTransaction,
  ...getOrderStatusLog(CrudApi.OrderStatus.served),
};

const activeSuccessStripeOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...stripePayment,
  ...successfullTransaction,
  ...getOrderStatusLog(CrudApi.OrderStatus.placed),
};

const historySuccessCardOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cardPayment,
  ...successfullTransaction,
};

const historySuccessCashOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cashPayment,
  ...successfullTransaction,
};

const historySuccessStripeOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...stripePayment,
  ...successfullTransaction,
};

const historyFailedCardStaffMealOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.staff_meal),
};

const historyFailedCardManagerMealOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.manager_meal),
};

const historyFailedCardMarketingPromoOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.marketing_promo),
};

const historyFailedCardErrorCookedOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.error_cooked),
};

const historyFailedCardErrorNoCookedOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.error_no_cooked),
};

const historyFailedCardPaymentModeChangedOrderInput: CrudApi.CreateOrderInput =
  {
    ...historyOrderInputBase,
    ...cardPayment,
    ...getFailedTransaction(CrudApi.UnpayCategory.payment_mode_change),
  };

const historyFailedCardOtherOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.other),
};

const historyFailedCardDeliveryOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.delivery),
};

const historyFailedCardCouponOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.coupon),
};

const historyFailedCardEventOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.event),
};

const historyFailedCashStaffMealOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.staff_meal),
};

const historyFailedCashManagerMealOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.manager_meal),
};

const historyFailedCashMarketingPromoOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.marketing_promo),
};

const historyFailedCashErrorCookedOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.error_cooked),
};

const historyFailedCashErrorNoCookedOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.error_no_cooked),
};

const historyFailedCashPaymentModeChangedOrderInput: CrudApi.CreateOrderInput =
  {
    ...historyOrderInputBase,
    ...cashPayment,
    ...getFailedTransaction(CrudApi.UnpayCategory.payment_mode_change),
  };

const historyFailedCashOtherOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.other),
};

const historyFailedCashDeliveryOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.delivery),
};

const historyFailedCashCouponOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.coupon),
};

const historyFailedCashEventOrderInput: CrudApi.CreateOrderInput = {
  ...historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.event),
};

const convertInputToOrder = (
  input: CrudApi.CreateOrderInput,
): CrudApi.Order => ({
  ...input,
  id: input.id || '',
  createdAt: '2021-08-02T01:54:11.843Z',
  updatedAt: '2021-08-02T01:54:11.843Z',
  statusLog: [],
  archived: !!input.archived,
});

export const orderFixture = {
  order_seeded_01_id,
  orderInputBase,
  orderItemInputBase,

  // Payment
  cardPayment,
  stripePayment,
  cashPayment,

  // Status
  getOrderStatusLogItem,
  getOrderStatusLog,

  // Transaction
  waitingTransaction,
  successfullTransaction,
  getFailedTransaction,

  // Order inputs
  activeWaitingCardOrderInput,
  activeWaitingCashOrderInput,
  activeWaitingStripeOrderInput,
  activeWaitingPlacedCardOrderInput,
  activeWaitingAfterPayOrderInput,
  activeSuccessPlacedCashOrderInput,
  activeSuccessCardOrderInput,
  activeSuccessCashOrderInput,
  activeSuccessStripeOrderInput,
  activeServedSuccessCardOrderInput,
  activeServedSuccessCashOrderInput,

  historySuccessCardOrderInput,
  historySuccessCashOrderInput,
  historySuccessStripeOrderInput,

  historyFailedCardStaffMealOrderInput,
  historyFailedCardManagerMealOrderInput,
  historyFailedCardMarketingPromoOrderInput,
  historyFailedCardErrorCookedOrderInput,
  historyFailedCardErrorNoCookedOrderInput,
  historyFailedCardPaymentModeChangedOrderInput,
  historyFailedCardOtherOrderInput,
  historyFailedCardDeliveryOrderInput,
  historyFailedCardCouponOrderInput,
  historyFailedCardEventOrderInput,

  historyFailedCashStaffMealOrderInput,
  historyFailedCashManagerMealOrderInput,
  historyFailedCashMarketingPromoOrderInput,
  historyFailedCashErrorCookedOrderInput,
  historyFailedCashErrorNoCookedOrderInput,
  historyFailedCashPaymentModeChangedOrderInput,
  historyFailedCashOtherOrderInput,
  historyFailedCashDeliveryOrderInput,
  historyFailedCashCouponOrderInput,
  historyFailedCashEventOrderInput,

  // Converter
  convertInputToOrder,
};
