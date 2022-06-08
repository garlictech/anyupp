import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  PaymentType,
  UnpayCategory,
} from '@bgap/domain';

export const getOrderStatusLogItem = (status: OrderStatus) => ({
  userId: 'test-alice',
  status,
  ts: 1627909024677,
});

export const getOrderStatusLog = (status: OrderStatus) => ({
  statusLog: [getOrderStatusLogItem(status)],
});

export const cardPayment = {
  paymentMode: {
    type: PaymentType.card,
    method: PaymentMethod.card,
  },
};

export const cashPayment = {
  paymentMode: {
    type: PaymentType.cash,
    method: PaymentMethod.cash,
  },
};

export const stripePayment = {
  paymentMode: {
    type: PaymentType.stripe,
    method: PaymentMethod.inapp,
  },
};

export const successfullTransaction = {
  transactionStatus: PaymentStatus.success,
};

export const getFailedTransaction = (unpayCategory: UnpayCategory) => ({
  transactionStatus: PaymentStatus.failed,
  unpayCategory,
});
