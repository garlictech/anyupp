import * as Joi from 'joi';

import { AmplifyApi } from '@bgap/crud-gql/api';

export const paymentMethodSchema = Joi.string().valid(
  AmplifyApi.PaymentMethod.CARD,
  AmplifyApi.PaymentMethod.CASH,
  AmplifyApi.PaymentMethod.INAPP,
);
