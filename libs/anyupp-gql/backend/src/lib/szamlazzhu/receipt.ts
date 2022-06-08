import * as Szamlazz from 'szamlazz.js';

import { Maybe, Order, Price, Transaction } from '@bgap/domain';

import { calculaterServiceFeeItems, getTranslation } from './utils';

export const createReceiptSzamlazzHu =
  (szamlazzClient: Szamlazz.Client) =>
  async ({
    transaction,
    order,
    language = Szamlazz.Language.Hungarian,
    paymentMethod = Szamlazz.PaymentMethod.Stripe,
  }: {
    transaction: Transaction;
    order: Order;
    language: Szamlazz.Interface.Language;
    paymentMethod?: Szamlazz.Interface.PaymentMethod;
  }): // unit?: Unit,
  Promise<Szamlazz.ReceiptResponse> => {
    // Unit
    //   let seller = new Szamlazz.Seller({
    //     // everyting is optional
    //     // bank: {
    //     //   name: "Test Bank <name>",
    //     //   accountNumber: "11111111-11111111-11111111",
    //     // },
    //     // email: {
    //     //   replyToAddress: "test@email.com",
    //     //   // subject: "Invoice email subject",
    //     //   // message: "This is an email message",
    //     // },
    //     // issuerName: "",
    //   });
    console.debug('receipt.language=' + language);

    // if (!user.invoiceAddress) {
    //   throw new Error("The user's invoiceAddress information is missing.");
    // }

    if (!transaction.currency) {
      throw new Error("The transaction's currency information is missing.");
    }
    if (!transaction.externalTransactionId) {
      throw new Error(
        'The externalTransactionId is missing from the transaction.',
      );
    }

    const currency: Szamlazz.Interface.Currency = Szamlazz.Currency.HUF; // should use currency from transaction.currency (Covered by #750)

    // User
    // let buyer = new Szamlazz.Buyer({
    //   name: user.invoiceAddress.customerName,
    //   country: user.invoiceAddress.country,
    //   zip: user.invoiceAddress.postalCode,
    //   city: user.invoiceAddress.city,
    //   address: user.invoiceAddress.streetAddress,
    //   taxNumber: user.invoiceAddress.taxNumber,
    //   phone: user.phone || '',
    //   email: user.invoiceAddress.email || '',
    //   sendEmail: !!user.invoiceAddress.email,
    // });

    // OrderItems
    const items = order.items.map(orderItem => {
      return new Szamlazz.ReceiptItem({
        label: `${getTranslation(orderItem.productName)} (${
          orderItem.sumPriceShown.tax
        }% ÁFA)`,
        quantity: orderItem.quantity,
        unit: 'db', // Should be translated it in the future (Covered by #751)
        vat: orderItem.sumPriceShown.tax, // can be a number or a special string
        grossUnitPrice: orderItem.sumPriceShown.pricePerUnit, // the szamlazz lib will calculate gross and net values from per item net
        // receiptItemId: orderItem.productId,
      });
    });

    const addPriceItem = (label: string, price?: Maybe<Price>) => {
      if (price) {
        items.push(
          new Szamlazz.ReceiptItem({
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

    const receipt = new Szamlazz.Receipt({
      paymentMethod, // optional, default: BankTransfer
      receiptNumberPrefix: 'KHU', // What kind of prefixes should we use ??? (Covered by #946)
      currency,
      comment: transaction.externalTransactionId,
      items: items,
    });
    console.debug(
      '### ~ file: receipt.ts ~ line 102 ~ receipt',
      JSON.stringify(receipt, undefined, 2),
    );

    try {
      return await szamlazzClient.issueReceipt(receipt);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error(error.message, error.code); // handle errors
      throw error;
    }
  };
