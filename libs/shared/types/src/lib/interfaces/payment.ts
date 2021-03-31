import * as Joi from 'joi';
import { AmplifyApi } from '@bgap/admin/amplify-api';
import { paymentMethodSchema } from '../validators/enums';

export interface IStripePayment {
  accountId: string;
}

export interface IPaymentMode {
  __typename?: 'PaymentMode';
  name: string;
  caption?: string;
  method: AmplifyApi.PaymentMethod;
}

export const paymentModeSchema: Joi.SchemaMap<IPaymentMode> = {
  __typename: Joi.string().valid('PaymentMode').optional(),
  name: Joi.string().required(),
  caption: Joi.string().allow(null),
  method: paymentMethodSchema.required(),
};
