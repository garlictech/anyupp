import * as CrudApi from '@bgap/crud-gql/api';

export const getOrderStatusLogItem = (status: CrudApi.OrderStatus) => ({
  userId: 'test-alice',
  status,
  ts: 1627909024677,
});

export const getOrderStatusLog = (status: CrudApi.OrderStatus) => ({
  statusLog: [getOrderStatusLogItem(status)],
});

export const cardPayment = {
  paymentMode: {
    type: CrudApi.PaymentType.card,
    method: CrudApi.PaymentMethod.card,
  },
};

export const cashPayment = {
  paymentMode: {
    type: CrudApi.PaymentType.cash,
    method: CrudApi.PaymentMethod.cash,
  },
};

export const stripePayment = {
  paymentMode: {
    type: CrudApi.PaymentType.stripe,
    method: CrudApi.PaymentMethod.inapp,
  },
};

export const successfullTransaction = {
  transactionStatus: CrudApi.PaymentStatus.success,
};

export const getFailedTransaction = (unpayCategory: CrudApi.UnpayCategory) => ({
  transactionStatus: CrudApi.PaymentStatus.failed,
  unpayCategory,
});
