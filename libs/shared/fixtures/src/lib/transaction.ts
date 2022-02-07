import * as CrudApi from '@bgap/crud-gql/api';

const transactionInputBase: CrudApi.CreateTransactionInput = {
  id: '',
  currency: 'HUF',
  orderId: '',
  userId: 'test-alice',
  total: 0,
  type: '',
};

const waitingTransaction = {
  status: CrudApi.PaymentStatus.waiting_for_payment,
};

const successTransaction = {
  status: CrudApi.PaymentStatus.success,
};

const failedTransaction = {
  status: CrudApi.PaymentStatus.failed,
};

const cashTransaction = {
  type: CrudApi.PaymentType.cash,
};

const cardTransaction = {
  type: CrudApi.PaymentType.card,
};

const stripeTransaction = {
  type: CrudApi.PaymentType.stripe,
};

const waitingCashTransactionInput: CrudApi.CreateTransactionInput = {
  ...transactionInputBase,
  ...waitingTransaction,
  ...cashTransaction,
};

const waitingCardTransactionInput: CrudApi.CreateTransactionInput = {
  ...transactionInputBase,
  ...waitingTransaction,
  ...cardTransaction,
};

const waitingStripeTransactionInput: CrudApi.CreateTransactionInput = {
  ...transactionInputBase,
  ...waitingTransaction,
  ...stripeTransaction,
};

const successCashTransactionInput: CrudApi.CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...cashTransaction,
};

const successCardTransactionInput: CrudApi.CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...cardTransaction,
};

const successCardTipTransactionInput: CrudApi.CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...cardTransaction,
  total: 1200,
};

const successStripeTransactionInput: CrudApi.CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...stripeTransaction,
};

const failedCashTransactionInput: CrudApi.CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...cashTransaction,
};

const failedCardTransactionInput: CrudApi.CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...cardTransaction,
};

const failedStripeTransactionInput: CrudApi.CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...stripeTransaction,
};

export const transactionFixture = {
  transactionInputBase,

  // Status
  waitingTransaction,
  successTransaction,
  failedTransaction,

  // Type
  cashTransaction,
  cardTransaction,
  stripeTransaction,

  // Input
  waitingCashTransactionInput,
  waitingCardTransactionInput,
  waitingStripeTransactionInput,

  successCashTransactionInput,
  successCardTransactionInput,
  successStripeTransactionInput,

  failedCashTransactionInput,
  failedCardTransactionInput,
  failedStripeTransactionInput,

  // Tip
  successCardTipTransactionInput,
};
