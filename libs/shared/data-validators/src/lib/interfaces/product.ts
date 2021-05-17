import * as Joi from 'joi';
import { validateSchema } from '../validator/validate';
import { IUnitProduct, IGroupProduct, IChainProduct } from '@bgap/shared/types';
import { localizedItemSchema } from './localized-item';

export const chainProductSchema: Joi.SchemaMap<IChainProduct> = {
  __typename: Joi.string().valid('ChainProduct').optional(),
  id: Joi.string().required(),
  chainId: Joi.string().required(),
  isVisible: Joi.boolean().required(),
  name: localizedItemSchema.required(),
  description: localizedItemSchema.required(),
  productCategoryId: Joi.string().required(),
  productType: Joi.string().required(), // TODO: use enumschema
  image: Joi.string().allow(null, ''),
  variants: Joi.array().required(), //TODO: use an exact schema
  configSets: Joi.array().optional().allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
  allergens: Joi.array().items(Joi.string()).optional().allow(null),
};

export const {
  validate: validateChainProduct,
  isType: isChainProduct,
} = validateSchema<IChainProduct>(chainProductSchema, 'ChainProduct');

export const groupProductSchema: Joi.SchemaMap<IGroupProduct> = {
  __typename: Joi.string().valid('GroupProduct').optional(),
  id: Joi.string().required(),
  parentId: Joi.string().required(),
  chainId: Joi.string().required(),
  groupId: Joi.string().required(),
  isVisible: Joi.boolean().required(),
  tax: Joi.number().required(),
  variants: Joi.array().required(), //TODO: use an exact schema
  configSets: Joi.array().optional().allow(null),
  chainProduct: Joi.object(chainProductSchema).allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const {
  validate: validateGroupProduct,
  isType: isGroupProduct,
} = validateSchema<IGroupProduct>(groupProductSchema, 'GroupProduct');

export const unitProductSchema: Joi.SchemaMap<IUnitProduct> = {
  __typename: Joi.string().valid('UnitProduct').optional(),
  id: Joi.string().required(),
  parentId: Joi.string().required(),
  chainId: Joi.string().required(),
  groupId: Joi.string().required(),
  unitId: Joi.string().required(),
  isVisible: Joi.boolean().required(),
  position: Joi.number().required(),
  variants: Joi.array().required(), //TODO: use an exact schema
  configSets: Joi.array().optional().allow(null),
  laneId: Joi.string().allow(null, ''),
  takeaway: Joi.boolean().allow(null),
  groupProduct: Joi.object(groupProductSchema).allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const {
  validate: validateUnitProduct,
  isType: isUnitProduct,
} = validateSchema<IUnitProduct>(unitProductSchema, 'UnitProduct');
