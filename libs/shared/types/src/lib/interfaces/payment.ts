import * as CrudApi from '@bgap/crud-gql/api';
import { AnyuppApi } from '@bgap/anyupp-gql/api';

export interface IStripePayment {
  accountId: string;
}

export type PaymentMode = CrudApi.PaymentMode | AnyuppApi.PaymentMode;
