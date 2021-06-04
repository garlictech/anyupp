import * as CrudApi from '@bgap/crud-gql/api';
import { InvoiceResponse } from './interfaces';

import * as Szamlazz from 'szamlazz.js';

export const createInvoice = (szamlazzClient: Szamlazz.Client) => async ({
  user,
  transaction,
  language = Szamlazz.Language.Hungarian,
  paymentMethod = Szamlazz.PaymentMethod.Stripe,
}: {
  user: CrudApi.User;
  transaction: CrudApi.Transaction;
  language: Szamlazz.Interface.Language;
  paymentMethod?: Szamlazz.Interface.PaymentMethod;
}): // unit?: CrudApi.Unit,
Promise<InvoiceResponse> => {
  // Unit
  let seller = new Szamlazz.Seller({
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

  if (!transaction.currency) {
    throw new Error("The user's invoiceAddress information is missing.");
  }
  if (!transaction.externalTransactionId) {
    throw new Error(
      'The externalTransactionId is missing from the transaction.',
    );
  }

  // TODO: user from transaction.currency
  const currency: Szamlazz.Interface.Currency = Szamlazz.Currency.HUF;

  // User
  let buyer = new Szamlazz.Buyer({
    name: user.invoiceAddress.customerName,
    country: user.invoiceAddress.country,
    zip: user.invoiceAddress.postalCode,
    city: user.invoiceAddress.city,
    address: user.invoiceAddress.streetAddress,
    taxNumber: user.invoiceAddress.taxNumber,
    phone: user.phone || '',
    email: user.invoiceAddress.email || '',
    sendEmail: !!user.invoiceAddress.email,
  });

  // OrderItems
  const items = transaction.order.items.map(orderItem => {
    // TODO: use the language input param
    let label = orderItem.productName.hu;
    if (!label) {
      label = orderItem.productName.en;
      if (!label) {
        throw new Error(
          `The required translation is missing for OrderItem with id productId: ${orderItem.productId}`,
        );
      }
    }
    return new Szamlazz.Item({
      label,
      quantity: orderItem.quantity,
      unit: 'db', // TODO: translate it in the future
      vat: orderItem.priceShown.tax, // can be a number or a special string
      grossUnitPrice: orderItem.priceShown.pricePerUnit, // calculates gross and net values from per item net
    });
  });

  // Transaction
  let invoice = new Szamlazz.Invoice({
    paymentMethod, // optional, default: BankTransfer
    currency,
    language, // optional, default: Hungarian
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
