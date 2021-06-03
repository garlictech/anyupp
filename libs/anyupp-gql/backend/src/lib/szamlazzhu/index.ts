import * as CrudApi from '@bgap/crud-gql/api';
const szamlazz = require('szamlazz.js');

export interface InvoiceResponse {
  invoiceId: string;
  netTotal: number;
  grossTotal: number;
}

export const createSzamlazzClient = (agentKey: string) =>
  new szamlazz.Client({
    authToken: agentKey,
    eInvoice: true, // create e-invoice. optional, default: false
    passphrase: '', // passphrase for e-invoice. optional
    requestInvoiceDownload: false, // downloads the issued pdf invoice. optional, default: false
    // downloadedInvoiceCount: 1, // optional, default: 1
    responseVersion: 1, // optional, default: 1
  });

export const createInvoice = async (
  szamlazzClient: any,
  user: CrudApi.User,
) => {
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

  let buyer = new szamlazz.Buyer({
    name: 'TEST with multiEMAIL Some Buyer Name ' + Math.random(),
    country: '',
    zip: '1234',
    city: 'City',
    address: 'Some street address',
    taxNumber: '12345678-1-42',
    postAddress: {
      name: 'Some Buyer Name',
      zip: '1234',
      city: 'City',
      address: 'Some street address',
    },
    issuerName: '',
    identifier: 1,
    phone: '',
    comment: '',
    email: user.email,
    sendEmail: !!user.email,
  });

  let soldItem1 = new szamlazz.Item({
    label: 'First item',
    quantity: 2,
    unit: 'qt',
    vat: 27, // can be a number or a special string
    netUnitPrice: 100.55, // calculates gross and net values from per item net
    comment: 'Ez egy árvíztűrő tükörfúrógép',
  });
  let soldItem2 = new szamlazz.Item({
    label: 'Second item',
    quantity: 5,
    unit: 'qt',
    vat: 27,
    grossUnitPrice: 1270, // calculates net and total values from per item gross
  });

  let invoice = new szamlazz.Invoice({
    paymentMethod: szamlazz.PaymentMethod.Stripe, // optional, default: BankTransfer
    currency: szamlazz.Currency.Ft, // optional, default: Ft
    language: szamlazz.Language.Hungarian, // optional, default: Hungarian
    seller: seller, // the seller, required
    buyer: buyer, // the buyer, required
    items: [soldItem1, soldItem2], // the sold items, required
    prepaymentInvoice: false, // prepayment/deposit invoice should be issued, optional, default: false
    paid: true,
  });

  try {
    return await szamlazzClient.issueInvoice(invoice);
  } catch (error) {
    console.error(error.message, error.code); // handle errors
    throw error;
  }
};
