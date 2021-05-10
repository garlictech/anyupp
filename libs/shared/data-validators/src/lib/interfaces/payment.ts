import * as Joi from 'joi';
import { paymentMethodSchema } from '../enums/enums';
import { PaymentMode } from '@bgap/anyupp-gql/api';

export const paymentModeSchema: Joi.SchemaMap<PaymentMode> = {
  __typename: Joi.string().valid('PaymentMode').optional(),
  name: Joi.string().required(),
  caption: Joi.string().allow(null, ''),
  method: paymentMethodSchema.required(),
};
