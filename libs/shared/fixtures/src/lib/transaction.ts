import {
  CreateTransactionInput,
  PaymentStatus,
  PaymentType,
} from '@bgap/domain';

const transactionInputBase: CreateTransactionInput = {
  id: '',
  currency: 'HUF',
  orderId: '',
  userId: 'test-alice',
  total: 0,
  type: '',
};

const waitingTransaction = {
  status: PaymentStatus.waiting_for_payment,
};

const successTransaction = {
  status: PaymentStatus.success,
};

const failedTransaction = {
  status: PaymentStatus.failed,
};

const cashTransaction = {
  type: PaymentType.cash,
};

const cardTransaction = {
  type: PaymentType.card,
};

const stripeTransaction = {
  type: PaymentType.stripe,
};

const waitingCashTransactionInput: CreateTransactionInput = {
  ...transactionInputBase,
  ...waitingTransaction,
  ...cashTransaction,
};

const waitingCardTransactionInput: CreateTransactionInput = {
  ...transactionInputBase,
  ...waitingTransaction,
  ...cardTransaction,
};

const waitingStripeTransactionInput: CreateTransactionInput = {
  ...transactionInputBase,
  ...waitingTransaction,
  ...stripeTransaction,
};

const waitingAfterPayTransactionInput: CreateTransactionInput = {
  ...transactionInputBase,
  ...waitingTransaction,
  ...stripeTransaction,
};

const successCashTransactionInput: CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...cashTransaction,
};

const successCardTransactionInput: CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...cardTransaction,
};

const successCardTipTransactionInput: CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...cardTransaction,
  total: 1200,
};

const successStripeTransactionInput: CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...stripeTransaction,
};

const failedCashTransactionInput: CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...cashTransaction,
};

const failedCardTransactionInput: CreateTransactionInput = {
  ...transactionInputBase,
  ...successTransaction,
  ...cardTransaction,
};

const failedStripeTransactionInput: CreateTransactionInput = {
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
  waitingAfterPayTransactionInput,

  successCashTransactionInput,
  successCardTransactionInput,
  successStripeTransactionInput,

  failedCashTransactionInput,
  failedCardTransactionInput,
  failedStripeTransactionInput,

  // Tip
  successCardTipTransactionInput,
};
