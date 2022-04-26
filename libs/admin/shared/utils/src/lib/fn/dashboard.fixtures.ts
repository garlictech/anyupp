import * as CrudApi from '@bgap/crud-gql/api';
import {
  cardPayment,
  cashPayment,
  getFailedTransaction,
  stripePayment,
} from '@bgap/shared/fixtures';
import { orderFixtureBase } from '@bgap/shared/fixtures';

export const historyFailedCardStaffMealOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.staff_meal),
};

export const historyFailedCardManagerMealOrderInput: CrudApi.CreateOrderInput =
  {
    ...orderFixtureBase.historyOrderInputBase,
    ...cardPayment,
    ...getFailedTransaction(CrudApi.UnpayCategory.manager_meal),
  };

export const historyFailedCardMarketingPromoOrderInput: CrudApi.CreateOrderInput =
  {
    ...orderFixtureBase.historyOrderInputBase,
    ...cardPayment,
    ...getFailedTransaction(CrudApi.UnpayCategory.marketing_promo),
  };

export const historyFailedCardErrorCookedOrderInput: CrudApi.CreateOrderInput =
  {
    ...orderFixtureBase.historyOrderInputBase,
    ...cardPayment,
    ...getFailedTransaction(CrudApi.UnpayCategory.error_cooked),
  };

export const historyFailedCardErrorNoCookedOrderInput: CrudApi.CreateOrderInput =
  {
    ...orderFixtureBase.historyOrderInputBase,
    ...cardPayment,
    ...getFailedTransaction(CrudApi.UnpayCategory.error_no_cooked),
  };

export const historyFailedCardPaymentModeChangedOrderInput: CrudApi.CreateOrderInput =
  {
    ...orderFixtureBase.historyOrderInputBase,
    ...cardPayment,
    ...getFailedTransaction(CrudApi.UnpayCategory.payment_mode_change),
  };

export const historyFailedCardOtherOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.other),
};

export const historyFailedCardDeliveryOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.delivery),
};

export const historyFailedCardCouponOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.coupon),
};

export const historyFailedCardEventOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.event),
};

export const historyFailedCashStaffMealOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.staff_meal),
};

export const historyFailedCashManagerMealOrderInput: CrudApi.CreateOrderInput =
  {
    ...orderFixtureBase.historyOrderInputBase,
    ...cashPayment,
    ...getFailedTransaction(CrudApi.UnpayCategory.manager_meal),
  };

export const historyFailedCashMarketingPromoOrderInput: CrudApi.CreateOrderInput =
  {
    ...orderFixtureBase.historyOrderInputBase,
    ...cashPayment,
    ...getFailedTransaction(CrudApi.UnpayCategory.marketing_promo),
  };

export const historyFailedCashErrorCookedOrderInput: CrudApi.CreateOrderInput =
  {
    ...orderFixtureBase.historyOrderInputBase,
    ...cashPayment,
    ...getFailedTransaction(CrudApi.UnpayCategory.error_cooked),
  };

export const historyFailedCashErrorNoCookedOrderInput: CrudApi.CreateOrderInput =
  {
    ...orderFixtureBase.historyOrderInputBase,
    ...cashPayment,
    ...getFailedTransaction(CrudApi.UnpayCategory.error_no_cooked),
  };

export const historyFailedCashPaymentModeChangedOrderInput: CrudApi.CreateOrderInput =
  {
    ...orderFixtureBase.historyOrderInputBase,
    ...cashPayment,
    ...getFailedTransaction(CrudApi.UnpayCategory.payment_mode_change),
  };

export const historyFailedCashOtherOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.other),
};

export const historyFailedCashDeliveryOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.delivery),
};

export const historyFailedCashCouponOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.coupon),
};

export const historyFailedCashEventOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
  ...getFailedTransaction(CrudApi.UnpayCategory.event),
};

export const historySuccessCashOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cashPayment,
};

export const historySuccessStripeOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...stripePayment,
};

export const historySuccessCardOrderInput: CrudApi.CreateOrderInput = {
  ...orderFixtureBase.historyOrderInputBase,
  ...cardPayment,
};
