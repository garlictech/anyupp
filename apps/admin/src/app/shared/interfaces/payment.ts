import { EPaymentMethod } from '../enums';

export interface IStripePayment {
  accountId: string;
}

export interface IPaymentMode {
  name: string;
  caption?: string;
  method: EPaymentMethod;
}
