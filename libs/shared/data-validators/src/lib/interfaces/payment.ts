import * as Joi from 'joi';
import { paymentMethodSchema } from '../enums/enums';
import { PaymentMode } from '@bgap/anyupp-gql/api';

export const paymentModeSchema: Joi.SchemaMap<PaymentMode> = {
  name: Joi.string().required(),
  caption: Joi.string().allow(null, ''),
  method: paymentMethodSchema.required(),
};
