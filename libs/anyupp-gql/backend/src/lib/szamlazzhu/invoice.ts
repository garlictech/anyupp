import * as CrudApi from '@bgap/crud-gql/api';
import { InvoiceResponse } from './interfaces';

const szamlazz = require('szamlazz.js');

export const createInvoice = (szamlazzClient: any) => async ({
  user,
  transaction,
  paymentMethod = szamlazz.PaymentMethod.Stripe,
}: {
  user: CrudApi.User;
  transaction: CrudApi.Transaction;
  paymentMethod?: string;
}): // unit?: CrudApi.Unit,
Promise<InvoiceResponse> => {
  // Unit
  let seller = new szamlazz.Seller({
    // everyting is optional
    // bank: {
    //   name: "Test Bank <name>",
    //   accountNumber: "11111111-11111111-11111111",
    // },
    // email: {
    //   replyToAddress: "test@email.com",
    //   // subject: "Invoice email subject",
    //   // message: "This is an email message",
    // },
    // issuerName: "",
  });

  if (!user.invoiceAddress) {
    throw new Error("The user's invoiceAddress information is missing.");
  }

  // User
  let buyer = new szamlazz.Buyer({
    name: user.invoiceAddress.customerName,
    country: user.invoiceAddress.country,
    zip: user.invoiceAddress.postalCode,
    city: user.invoiceAddress.city,
    address: user.invoiceAddress.streetAddress,
    taxNumber: user.invoiceAddress.taxNumber,
    phone: user.phone,
    email: user.invoiceAddress.email,
    sendEmail: !!user.invoiceAddress.email,
  });

  // OrderItems
  const items = transaction.order.items.map(
    orderItem =>
      new szamlazz.Item({
        label: orderItem.productName,
        quantity: orderItem.quantity,
        unit: 'db', // TODO: translate it in the future
        vat: orderItem.priceShown.tax, // can be a number or a special string
        grossUnitPrice: orderItem.priceShown.pricePerUnit, // calculates gross and net values from per item net
      }),
  );

  // Transaction
  let invoice = new szamlazz.Invoice({
    paymentMethod, // optional, default: BankTransfer
    currency: transaction.currency, // optional, default: Ft
    language: szamlazz.Language.Hungarian, // optional, default: Hungarian
    seller: seller, // the seller, required
    buyer: buyer, // the buyer, required
    items, // the sold items, required
    prepaymentInvoice: false, // prepayment/deposit invoice should be issued, optional, default: false
    paid: true,
    comment: transaction.externalTransactionId,
  });
  console.log(
    '### ~ file: invoice.ts ~ line 72 ~ invoice',
    JSON.stringify(invoice, undefined, 2),
  );

  try {
    return await szamlazzClient.issueInvoice(invoice);
  } catch (error) {
    console.error(error.message, error.code); // handle errors
    throw error;
  }
};
