import * as Joi from 'joi';
import { ICart } from '@bgap/shared/types';

import { paymentModeSchema } from './payment';
import { validateSchema } from '../validation/validate';
import { placeSchema, orderItemSchema } from './order';

export const cartSchema: Joi.SchemaMap<ICart> = {
  __typename: Joi.string().valid('Cart').optional(),
  id: Joi.string().required(),
  userId: Joi.string().required(),
  unitId: Joi.string().required(),
  takeAway: Joi.boolean().required(),
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
