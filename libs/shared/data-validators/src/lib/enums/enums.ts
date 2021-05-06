import * as Joi from 'joi';

import * as CrudApi from '@bgap/crud-gql/api';

export const paymentMethodSchema = Joi.string().valid(
  CrudApi.PaymentMethod.card,
  CrudApi.PaymentMethod.cash,
  CrudApi.PaymentMethod.inapp,
);
