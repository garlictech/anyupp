import * as Joi from 'joi';
import { paymentMethodSchema } from '../validators/enums';
import { IPaymentMode } from '@bgap/shared/types';

export const paymentModeSchema: Joi.SchemaMap<IPaymentMode> = {
  __typename: Joi.string().valid('PaymentMode').optional(),
  name: Joi.string().required(),
  caption: Joi.string().allow(null),
  method: paymentMethodSchema.required(),
};
