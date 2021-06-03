import * as Joi from 'joi';
import * as CrudApi from '@bgap/crud-gql/api';
import { validateSchema } from '../validator/validate';
import { addressSchema } from './address';
import { contactSchema } from './contact';
import { localizedItemSchema } from './localized-item';

export const chainStyleSchema: Joi.SchemaMap<CrudApi.ChainStyle> = {
  colors: Joi.object().required(),
  images: Joi.object().allow(null),
};

export const chainSchema: Joi.SchemaMap<CrudApi.Chain> = {
  id: Joi.string().required(),
  isActive: Joi.boolean().required(),
  name: Joi.string().required(),
  description: localizedItemSchema.required(),
  style: Joi.object(chainStyleSchema).required(),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
  address: Joi.object(addressSchema).allow(null),
  ...contactSchema,
};

export const { validate: validateChain, isType: isChain } = validateSchema<
  CrudApi.Chain
>(chainSchema, 'Chain');
