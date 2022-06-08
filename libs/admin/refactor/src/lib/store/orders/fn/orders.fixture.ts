import { CreateOrderInput, OrderStatus, PaymentStatus } from '@bgap/domain';
import {
  cardPayment,
  cashPayment,
  getOrderStatusLog,
  orderFixtureBase as ox,
  successfullTransaction,
} from '@bgap/shared/fixtures';

const activeOrderInputBase = {
  ...ox.orderInputBase,
  ...getOrderStatusLog(OrderStatus.none),
  orderNum: '000000',
  archived: false,
};

export const activeWaitingCardOrderInput: CreateOrderInput = {
  ...activeOrderInputBase,
  ...cardPayment,
  transactionStatus: PaymentStatus.waiting_for_payment,
};

export const activeWaitingCashOrderInput: CreateOrderInput = {
  ...activeOrderInputBase,
  ...cashPayment,
  transactionStatus: PaymentStatus.waiting_for_payment,
};

export const activeServedSuccessCardOrderInput: CreateOrderInput = {
  ...activeOrderInputBase,
  ...cardPayment,
  ...successfullTransaction,
  ...getOrderStatusLog(OrderStatus.served),
};

export const activeServedSuccessCashOrderInput: CreateOrderInput = {
  ...activeOrderInputBase,
  ...cashPayment,
  ...successfullTransaction,
  ...getOrderStatusLog(OrderStatus.served),
};
