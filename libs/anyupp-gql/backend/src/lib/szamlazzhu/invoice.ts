import * as Szamlazz from 'szamlazz.js';

import { Maybe, Order, Price, Transaction, User } from '@bgap/domain';

import { calculaterServiceFeeItems, getTranslation } from './utils';

export const createInvoice =
  (szamlazzClient: Szamlazz.Client) =>
  async ({
    user,
    transaction,
    order,
    language = Szamlazz.Language.Hungarian,
    paymentMethod = Szamlazz.PaymentMethod.Stripe,
  }: {
    user: User;
    transaction: Transaction;
    order: Order;
    language?: Szamlazz.Interface.Language;
    paymentMethod?: Szamlazz.Interface.PaymentMethod;
  }): Promise<Szamlazz.InvoiceResponse> => {
    // Unit
    const seller = new Szamlazz.Seller({});

    if (!user.invoiceAddress) {
      throw new Error("The user's invoiceAddress information is missing.");
    }

    if (!transaction.currency) {
      throw new Error('The transaction currency is missing.');
    }
    if (!transaction.externalTransactionId) {
      throw new Error(
        'The externalTransactionId is missing from the transaction.',
      );
    }
    const currency: Szamlazz.Interface.Currency = Szamlazz.Currency.HUF; // should use currency from transaction.currency (Covered by #750)

    // User
    const buyer = new Szamlazz.Buyer({
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
    const items = order.items.map(
      orderItem =>
        new Szamlazz.Item({
          label: `${getTranslation(orderItem.productName)} (${
            orderItem.sumPriceShown.tax
          }% ÁFA)`,
          quantity: orderItem.quantity,
          unit: 'db',
          vat: orderItem.sumPriceShown.tax, // can be a number or a special string
          grossUnitPrice: orderItem.sumPriceShown.pricePerUnit, // calculates gross and net values from per item net
        }),
    );

    const addPriceItem = (label: string, price?: Maybe<Price>) => {
      if (price) {
        items.push(
          new Szamlazz.Item({
            label,
            quantity: 1,
            unit: 'db',
            vat: price.taxPercentage, // can be a number or a special string
            grossUnitPrice: price.netPrice * (1 + price.taxPercentage / 100), // can be a number or a special string
          }),
        );
      }
    };

    addPriceItem('Csomagolás', order.packagingSum);

    calculaterServiceFeeItems(
      order.serviceFeePolicy,
      order.items,
      order.sumPriceShown.currency,
    ).forEach(([title, price]) => addPriceItem(title, price));

    // Transaction
    const invoice = new Szamlazz.Invoice({
      paymentMethod, // optional, default: BankTransfer
      currency,
      language, // optional, default: Hungarian
      seller, // the seller, required
      buyer, // the buyer, required
      items, // the sold items, required
      prepaymentInvoice: false, // prepayment/deposit invoice should be issued, optional, default: false
      paid: true,
      comment: transaction.externalTransactionId,
    });

    return await szamlazzClient.issueInvoice(invoice);
  };
