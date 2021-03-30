import * as Joi from 'joi';

import { IPaymentMode, paymentModeSchema } from './payment';
import { validateSchema } from '../validation/validate';
import { IOrderItem, IPlace, placeSchema, orderItemSchema } from './order';

export interface ICart {
  __typename?: 'Cart';
  id: string;
  userId: string;
  unitId: string;
  takeAway: boolean;
  place?: IPlace;
  paymentMode?: IPaymentMode;
  items: Array<IOrderItem>;
  createdAt: string;
  updatedAt: string;
}

export const cartSchema: Joi.SchemaMap<ICart> = {
  __typename: Joi.string().valid('Cart').optional(),
  id: Joi.string().required(),
  userId: Joi.string().required(),
  unitId: Joi.string().required(),
  place: Joi.object(placeSchema),
  paymentMode: Joi.object(paymentModeSchema),
  items: Joi.array().items(orderItemSchema),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const { validate: validateCart, isType: isCart } = validateSchema<ICart>(
  cartSchema,
  'Cart',
);
