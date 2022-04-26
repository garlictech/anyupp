import * as CrudApi from '@bgap/crud-gql/api';
import {
  orderFixtureBase as ox,
  getOrderStatusLog,
  cardPayment,
  cashPayment,
  successfullTransaction,
} from '@bgap/shared/fixtures';

const activeOrderInputBase = {
  ...ox.orderInputBase,
  ...getOrderStatusLog(CrudApi.OrderStatus.none),
  orderNum: '000000',
  archived: false,
};

export const activeWaitingCardOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...cardPayment,
  transactionStatus: CrudApi.PaymentStatus.waiting_for_payment,
};

export const activeWaitingCashOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...cashPayment,
  transactionStatus: CrudApi.PaymentStatus.waiting_for_payment,
};

export const activeServedSuccessCardOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...cardPayment,
  ...successfullTransaction,
  ...getOrderStatusLog(CrudApi.OrderStatus.served),
};

export const activeServedSuccessCashOrderInput: CrudApi.CreateOrderInput = {
  ...activeOrderInputBase,
  ...cashPayment,
  ...successfullTransaction,
  ...getOrderStatusLog(CrudApi.OrderStatus.served),
};
