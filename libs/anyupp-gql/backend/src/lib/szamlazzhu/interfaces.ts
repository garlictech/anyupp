export interface InvoiceResponse {
  invoiceId: string;
  netTotal: number;
  grossTotal: number;
}

export interface ReceiptResponse {
  invoiceId: string;
  netTotal: number;
  grossTotal: number;
  pdf: string;
}
