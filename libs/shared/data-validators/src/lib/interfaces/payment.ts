import * as Joi from 'joi';
import { paymentMethodSchema, paymentTypeSchema } from '../enums/enums';
import { PaymentMode } from '@bgap/anyupp-gql/api';

export const paymentModeSchema: Joi.SchemaMap<PaymentMode> = {
  type: paymentTypeSchema.required(),
  caption: Joi.string().allow(null, ''),
  method: paymentMethodSchema.required(),
};
