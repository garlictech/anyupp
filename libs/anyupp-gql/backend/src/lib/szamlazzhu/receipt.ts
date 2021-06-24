import * as CrudApi from '@bgap/crud-gql/api';
import * as Szamlazz from 'szamlazz.js';

export const createReceiptSzamlazzHu =
  (szamlazzClient: Szamlazz.Client) =>
  async ({
    transaction,
    order,
    language = Szamlazz.Language.Hungarian,
    paymentMethod = Szamlazz.PaymentMethod.Stripe,
  }: {
    transaction: CrudApi.Transaction;
    order: CrudApi.Order;
    language: Szamlazz.Interface.Language;
    paymentMethod?: Szamlazz.Interface.PaymentMethod;
  }): // unit?: CrudApi.Unit,
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
      let label = orderItem.productName.hu; // Should use the language input param (Covered by #750)
      if (!label) {
        label = orderItem.productName.en;
        if (!label) {
          throw new Error(
            `The required translation is missing for OrderItem with id productId: ${orderItem.productId}`,
          );
        }
      }
      return new Szamlazz.ReceiptItem({
        label,
        quantity: orderItem.quantity,
        unit: 'db', // Should be translated it in the future (Covered by #751)
        vat: orderItem.sumPriceShown.tax, // can be a number or a special string
        grossUnitPrice: orderItem.sumPriceShown.pricePerUnit, // the szamlazz lib will calculate gross and net values from per item net
        receiptItemId: orderItem.productId,
      });
    });

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
    } catch (error) {
      console.error(error.message, error.code); // handle errors
      throw error;
    }
  };
