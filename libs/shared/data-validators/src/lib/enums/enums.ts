import * as Joi from 'joi';

import { AmplifyApi } from '@bgap/admin/amplify-api';

export const paymentMethodSchema = Joi.string().valid(
  AmplifyApi.PaymentMethod.CARD,
  AmplifyApi.PaymentMethod.CASH,
  AmplifyApi.PaymentMethod.INAPP,
);
