import { CreateOrderInput, UnpayCategory } from '@bgap/domain';
import {
  cardPayment,
  cashPayment,
  getFailedTransaction,
  orderFixtureBase,
  stripePayment,
} from '@bgap/shared/fixtures';

export const historyFailedCardStaffMealOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(UnpayCategory.staff_meal),
};

export const historyFailedCardManagerMealOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(UnpayCategory.manager_meal),
};

export const historyFailedCardMarketingPromoOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(UnpayCategory.marketing_promo),
};

export const historyFailedCardErrorCookedOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(UnpayCategory.error_cooked),
};

export const historyFailedCardErrorNoCookedOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(UnpayCategory.error_no_cooked),
};

export const historyFailedCardPaymentModeChangedOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(UnpayCategory.payment_mode_change),
};

export const historyFailedCardOtherOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(UnpayCategory.other),
};

export const historyFailedCardDeliveryOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(UnpayCategory.delivery),
};

export const historyFailedCardCouponOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(UnpayCategory.coupon),
};

export const historyFailedCardEventOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(UnpayCategory.event),
};

export const historyFailedCashStaffMealOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(UnpayCategory.staff_meal),
};

export const historyFailedCashManagerMealOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(UnpayCategory.manager_meal),
};

export const historyFailedCashMarketingPromoOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(UnpayCategory.marketing_promo),
};

export const historyFailedCashErrorCookedOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(UnpayCategory.error_cooked),
};

export const historyFailedCashErrorNoCookedOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(UnpayCategory.error_no_cooked),
};

export const historyFailedCashPaymentModeChangedOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(UnpayCategory.payment_mode_change),
};

export const historyFailedCashOtherOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(UnpayCategory.other),
};

export const historyFailedCashDeliveryOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(UnpayCategory.delivery),
};

export const historyFailedCashCouponOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(UnpayCategory.coupon),
};

export const historyFailedCashEventOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(UnpayCategory.event),
};

export const historySuccessCashOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
};

export const historySuccessStripeOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...stripePayment,
};

export const historySuccessCardOrderInput: CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
};
