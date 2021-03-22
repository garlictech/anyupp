import * as Joi from 'joi';

export enum EPaymentMethod {
  CASH = 'CASH',
  CARD = 'CARD',
  INAPP = 'INAPP',
}

export const paymentMethodSchema = Joi.string().valid(
  EPaymentMethod.CARD,
  EPaymentMethod.CASH,
  EPaymentMethod.INAPP,
);
