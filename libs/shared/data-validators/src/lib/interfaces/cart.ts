import * as Joi from 'joi';
import * as CrudApi from '@bgap/crud-gql/api';

import { paymentModeSchema } from './payment';
import { validateSchema } from '../validator/validate';
import { placeSchema, orderItemSchema } from './order';

export const cartSchema: Joi.SchemaMap<CrudApi.Cart> = {
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

export const { validate: validateCart, isType: isCart } = validateSchema<
  CrudApi.Cart
>(cartSchema, 'Cart');
