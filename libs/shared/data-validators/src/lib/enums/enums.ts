import * as Joi from 'joi';

import * as CrudApi from '@bgap/crud-gql/api';

export const paymentMethodSchema = Joi.string().valid(
  CrudApi.PaymentMethod.card,
  CrudApi.PaymentMethod.cash,
  CrudApi.PaymentMethod.inapp,
);

export const paymentTypeSchema = Joi.string().valid(
  CrudApi.PaymentType.card,
  CrudApi.PaymentType.cash,
  CrudApi.PaymentType.googlepay,
  CrudApi.PaymentType.applepay,
  CrudApi.PaymentType.stripe,
  CrudApi.PaymentType.simple,
);
