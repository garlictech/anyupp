import * as Joi from 'joi';
import { validateSchema } from '../validator/validate';
import { localizedItemSchema } from './localized-item';
import * as CrudApi from '@bgap/crud-gql/api';

export const chainProductSchema: Joi.SchemaMap<CrudApi.ChainProduct> = {
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
} = validateSchema<CrudApi.ChainProduct>(chainProductSchema, 'ChainProduct');

export const groupProductSchema: Joi.SchemaMap<CrudApi.GroupProduct> = {
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
} = validateSchema<CrudApi.GroupProduct>(groupProductSchema, 'GroupProduct');

export const unitProductSchema: Joi.SchemaMap<CrudApi.UnitProduct> = {
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
} = validateSchema<CrudApi.UnitProduct>(unitProductSchema, 'UnitProduct');
