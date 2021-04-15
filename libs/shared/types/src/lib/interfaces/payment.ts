import { AmplifyApi } from '@bgap/crud-gql/api';

export interface IStripePayment {
  accountId: string;
}

export interface IPaymentMode {
  __typename?: 'PaymentMode';
  name: string;
  caption?: string;
  method: AmplifyApi.PaymentMethod;
}

