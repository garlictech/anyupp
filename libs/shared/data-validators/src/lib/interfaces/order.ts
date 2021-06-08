import * as Joi from 'joi';
import * as CrudApi from '@bgap/crud-gql/api';

import { validateSchema } from '../validator/validate';
import { localizedItemSchema } from './localized-item';
import { paymentModeSchema } from './payment';

export const priceShownSchema: Joi.SchemaMap<CrudApi.PriceShown> = {
  currency: Joi.string().required(),
  pricePerUnit: Joi.number().required(),
  priceSum: Joi.number().required().optional(),
  tax: Joi.number().required(),
  taxSum: Joi.number().required().optional(),
};

export const statusLogSchema = Joi.array();

export const orderItemSchema: Joi.SchemaMap<CrudApi.OrderItem> = {
  created: Joi.number().positive().allow(null),
  productName: localizedItemSchema.required(),
  priceShown: Joi.object(priceShownSchema).required(),
  productId: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  statusLog: statusLogSchema.required(),
  variantId: Joi.string().required(),
  variantName: localizedItemSchema.required(),
  laneId: Joi.string().allow(null, ''),
  image: Joi.string().allow(null, ''),
  allergens: Joi.array().items(Joi.string()).allow(null),
  configSets: Joi.array().allow(null),
};

export const placeSchema: Joi.SchemaMap<CrudApi.Place> = {
  seat: Joi.string().required(),
  table: Joi.string().required(),
};

export const orderSchema: Joi.SchemaMap<CrudApi.Order> = {
  id: Joi.string().required(),
  userId: Joi.string().required(),
  unitId: Joi.string().required(),
  orderNum: Joi.string().allow(null, ''),
  items: Joi.array().items(orderItemSchema),
  paymentMode: Joi.object(paymentModeSchema).required(),
  statusLog: statusLogSchema.required(),
  archived: Joi.boolean().allow(null),
  sumPriceShown: Joi.object(priceShownSchema).required(),
  takeAway: Joi.boolean().required(),
  place: Joi.object(placeSchema).required(),
  paymentIntention: Joi.number().allow(null),
  transactionId: Joi.string().allow(null, ''),
  transaction: Joi.object().allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const { validate: validateOrder, isType: isOrder } = validateSchema<
  CrudApi.Order
>(orderSchema, 'Order');
