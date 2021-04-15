import * as Joi from 'joi';

import { CrudApi } from '@bgap/crud-gql/api';

export const paymentMethodSchema = Joi.string().valid(
  CrudApi.PaymentMethod.CARD,
  CrudApi.PaymentMethod.CASH,
  CrudApi.PaymentMethod.INAPP,
);
