import * as AnyuppApi from '@bgap/anyupp-gql/api';
import * as CrudApi from '@bgap/crud-gql/api';
import { createInvoice } from './stripe-graphql-crud';
import { StripeResolverDeps } from './stripe.utils';

export const createInvoiceAndConnectTransaction = (
  orderId: string,
  userId: string,
  transactionId: string,
  invoiceAddress: AnyuppApi.UserInvoiceAddress,
  status: CrudApi.InvoiceStatus,
) => async (deps: StripeResolverDeps) => {
  console.log('createInvoiceAndConnectTransaction().orderId=' + orderId);

  const createInvoiceVars = createInvoiceMutationVariables(
    orderId,
    userId,
    transactionId,
    invoiceAddress,
    status,
  );
  const invoice = await createInvoice(createInvoiceVars)(deps);
  if (!invoice) {
    throw Error('Invoice not created. Created invoice instane is null');
  }
  console.log('createInvoiceAndConnectTransaction().invoiceId=' + invoice.id);
  await updateTransactionInvoiceId(transactionId, invoice.id)(deps);
};

export const createReceiptAndConnectTransaction = (
  orderId: string,
  userId: string,
  transactionId: string,
  email: string | undefined | null,
  status: CrudApi.ReceiptStatus,
) => async (deps: StripeResolverDeps) => {
  console.log('createReceiptAndConnectTransaction().orderId=' + orderId);

  const receiptId = 'SZAMLAZZHU_RECEIPT_ID'; // TODO GET FROM SZAMLAZZ.HU!!!!
  const receiptUrl = 'SZAMLAZZHU_RECEIPT_PDF_URL'; // TODO GET FROM SZAMLAZZ.HU!!!!

  const createReceiptVars = createReceiptMutationVariables(
    orderId,
    userId,
    transactionId,
    email,
    status,
    receiptId,
    receiptUrl,
  );
  const receipt = await deps.crudSdk
    .CreateReceipt(createReceiptVars)
    .toPromise();
  if (!receipt) {
    throw Error('Receipt not created. Created receipt instane is null');
  }
  console.log('createReceiptAndConnectTransaction().receiptId=' + receipt.id);
  await updateTransactionReceiptId(transactionId, receipt.id)(deps);
};

const createInvoiceMutationVariables = (
  orderId: string,
  userId: string,
  transactionId: string,
  invoiceAddress: AnyuppApi.UserInvoiceAddress,
  status: CrudApi.InvoiceStatus,
): CrudApi.CreateInvoiceMutationVariables => {
  return {
    input: {
      userId: userId,
      orderId: orderId,
      transactionId: transactionId,
      city: invoiceAddress.city,
      country: invoiceAddress.country,
      customerName: invoiceAddress.customerName,
      postalCode: invoiceAddress.postalCode,
      streetAddress: invoiceAddress.streetAddress,
      taxNumber: invoiceAddress.taxNumber,
      email: invoiceAddress.email,
      status: status,
    },
  };
};

const createReceiptMutationVariables = (
  orderId: string,
  userId: string,
  transactionId: string,
  email: string | undefined | null,
  status: CrudApi.ReceiptStatus,
  receiptId: string,
  pdfUrl: string,
): CrudApi.CreateReceiptMutationVariables => {
  return {
    input: {
      orderId: orderId,
      userId: userId,
      transactionId: transactionId,
      email: email,
      status: status,
      pdfUrl: pdfUrl,
      externalReceiptId: receiptId,
    },
  };
};

const updateTransactionInvoiceId = (id: string, invoiceId: string) => (
  deps: StripeResolverDeps,
) => {
  const updateTransactionVars: CrudApi.UpdateTransactionMutationVariables = {
    input: {
      id,
      invoiceId,
    },
  };

  return deps.crudSdk.UpdateTransaction(updateTransactionVars).toPromise();
};

const updateTransactionReceiptId = (id: string, receiptId: string) => (
  deps: StripeResolverDeps,
) => {
  const updateTransactionVars: CrudApi.UpdateTransactionMutationVariables = {
    input: {
      id,
      receiptId,
    },
  };

  return deps.crudSdk.UpdateTransaction(updateTransactionVars).toPromise();
};
