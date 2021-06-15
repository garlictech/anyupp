import * as Joi from 'joi';
import { validateGqlList, validateSchema } from '../validator/validate';
import { localizedItemSchema } from './localized-item';
import * as CrudApi from '@bgap/crud-gql/api';

export const allergenListSchema = Joi.array().items(Joi.string());

export const chainProductSchema: Joi.SchemaMap<CrudApi.ChainProduct> = {
  id: Joi.string().required(),
  chainId: Joi.string().required(),
  isVisible: Joi.boolean().required(),
  name: localizedItemSchema.required(),
  description: localizedItemSchema.allow(null),
  productCategoryId: Joi.string().required(),
  productType: Joi.string().required(), // TODO: use enumschema
  image: Joi.string().allow(null, ''),
  variants: Joi.array().allow(null), //TODO: use an exact schema
  configSets: Joi.array().allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
  allergens: allergenListSchema.allow(null),
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
  variants: Joi.array().allow(null), //TODO: use an exact schema
  configSets: Joi.array().allow(null),
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
  variants: Joi.array().allow(null), //TODO: use an exact schema
  configSets: Joi.array().allow(null),
  laneId: Joi.string().allow(null, ''),
  takeaway: Joi.boolean().allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const {
  validate: validateUnitProduct,
  isType: isUnitProduct,
} = validateSchema<CrudApi.UnitProduct>(unitProductSchema, 'UnitProduct');

export const {
  validate: validateUnitProductList,
  isType: isUnitProductList,
} = validateGqlList<CrudApi.UnitProduct>(unitProductSchema, 'UnitProductList');

export const generatedProductSchema: Joi.SchemaMap<CrudApi.GeneratedProduct> = {
  id: Joi.string().required(),
  unitId: unitProductSchema.unitId,
  productCategoryId: chainProductSchema.productCategoryId,
  name: chainProductSchema.name,
  description: chainProductSchema.description,
  productType: chainProductSchema.productType,
  image: chainProductSchema.image,
  allergens: chainProductSchema.allergens,
  tax: groupProductSchema.tax,
  position: unitProductSchema.position,
  variants: Joi.array().required(), //TODO: use an exact schema GeneratedProductVariant
  configSets: Joi.array().allow(null), //TODO: use an exact schema GeneratedProductVariant
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const {
  validate: validateGeneratedProduct,
  isType: isGeneratedProduct,
} = validateSchema<CrudApi.GeneratedProduct>(
  generatedProductSchema,
  'GeneratedProduct',
);

export const {
  validate: validateGeneratedProductList,
  isType: isGeneratedProductList,
} = validateGqlList<CrudApi.GeneratedProduct>(
  generatedProductSchema,
  'GeneratedProductList',
);
