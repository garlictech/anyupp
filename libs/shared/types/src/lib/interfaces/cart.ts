import * as Joi from 'joi';

import { IOrderItem, IPlace, placeSchema } from './order';
import { validateSchema } from '@bgap/shared/utils';
import { EPaymentMethod, paymentMethodSchema } from '../enums/payment-method';

export interface ICart {
  id: string;
  userId: string;
  unitId: string;
  place: IPlace;
  paymentMethod: EPaymentMethod;
  items: Array<IOrderItem>;
  createdAt: string;
  updatedAt: string;
}

export const cartSchema: Joi.SchemaMap = {
  id: Joi.string().required(),
  userId: Joi.string().required(),
  unitId: Joi.string().required(),
  place: Joi.object(placeSchema),
  paymentMethod: paymentMethodSchema.required(),
  items: Joi.array().required(),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};
export const { validate: validateCart, isType: isCart } = validateSchema<ICart>(
  cartSchema,
);
