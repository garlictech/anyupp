import * as CrudApi from '@bgap/crud-gql/api';
import * as Szamlazz from 'szamlazz.js';

export const createInvoice =
  (szamlazzClient: Szamlazz.Client) =>
  async ({
    user,
    transaction,
    order,
    language = Szamlazz.Language.Hungarian,
    paymentMethod = Szamlazz.PaymentMethod.Stripe,
  }: {
    user: CrudApi.User;
    transaction: CrudApi.Transaction;
    order: CrudApi.Order;
    language: Szamlazz.Interface.Language;
    paymentMethod?: Szamlazz.Interface.PaymentMethod;
  }): // unit?: CrudApi.Unit,
  Promise<Szamlazz.InvoiceResponse> => {
    // Unit
    const seller = new Szamlazz.Seller({
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
      return new Szamlazz.Item({
        label,
        quantity: orderItem.quantity,
        unit: 'db', // Should be translated it in the future (Covered by #751)
        vat: orderItem.sumPriceShown.tax, // can be a number or a special string
        grossUnitPrice: orderItem.sumPriceShown.pricePerUnit, // calculates gross and net values from per item net
      });
    });

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
    // console.debug(
    //   '### ~ file: invoice.ts ~ line 72 ~ invoice',
    //   JSON.stringify(invoice, undefined, 2),
    // );

    try {
      return await szamlazzClient.issueInvoice(invoice);
    } catch (error) {
      console.error(error.message, error.code); // handle errors
      throw error;
    }
  };
