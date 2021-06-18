import * as Szamlazz from 'szamlazz.js';

export const createSzamlazzClient = (agentKey: string) =>
  new Szamlazz.Client({
    authToken: agentKey,
    eInvoice: true, // create e-invoice. optional, default: false
    passphrase: '', // passphrase for e-invoice. optional
    requestInvoiceDownload: false, // downloads the issued pdf invoice. optional, default: false
    // downloadedInvoiceCount: 1, // optional, default: 1
    responseVersion: Szamlazz.ResponseVersion.Xml, // optional, default: 1
  });
