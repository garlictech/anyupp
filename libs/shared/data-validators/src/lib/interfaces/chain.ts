import * as Joi from 'joi';

import { IChain, IChainStyle } from '@bgap/shared/types';

import { validateSchema } from '../validator/validate';
import { addressSchema } from './address';
import { contactSchema } from './contact';
import { localizedItemSchema } from './localized-item';

export const chainStyleSchema: Joi.SchemaMap<IChainStyle> = {
  __typename: Joi.string().valid('ChainStyle').optional(),
  colors: Joi.object().required(),
  images: Joi.object().allow(null),
};

export const chainSchema: Joi.SchemaMap<IChain> = {
  __typename: Joi.string().valid('Chain').optional(),
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
  IChain
>(chainSchema, 'Chain');
