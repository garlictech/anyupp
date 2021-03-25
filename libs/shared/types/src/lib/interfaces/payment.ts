import { EPaymentMethod, paymentMethodSchema } from '../enums';
import * as Joi from 'joi';

export interface IStripePayment {
  accountId: string;
}

export interface IPaymentMode {
  __typename?: 'PaymentMode';
  name: string;
  caption?: string;
  method: EPaymentMethod;
}

export const paymentModeSchema: Joi.SchemaMap<IPaymentMode> = {
  __typename: Joi.string().valid('PaymentMode').optional(),
  name: Joi.string().required(),
  caption: Joi.string().allow(null),
  method: paymentMethodSchema.required(),
};
