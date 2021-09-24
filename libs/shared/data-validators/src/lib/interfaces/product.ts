import * as CrudApi from '@bgap/crud-gql/api';
import * as Joi from 'joi';
import { servingModeSchema } from '../enums/enums';
import { validateGqlList, validateSchema } from '../validator/validate';
import { localizedItemSchema } from './localized-item';
import { getUpdateSchema } from './utils';

export const allergenListSchema = Joi.array().items(Joi.string());

export const chainProductSchema: Joi.SchemaMap<CrudApi.ChainProduct> = {
  id: Joi.string().required(),
  chainId: Joi.string().required(),
  isVisible: Joi.boolean().required(),
  name: localizedItemSchema.required(),
  description: localizedItemSchema.allow(null),
  productCategoryId: Joi.string().required(),
  productType: Joi.string().required(), // use enumschema (Covered by #784)
  image: Joi.string().allow(null, ''),
  variants: Joi.array().allow(null), // use an exact schema ProductVariant (Covered by #784)
  configSets: Joi.array().allow(null), // use an exact schema ProductConfigSet (Covered by #784)
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
  allergens: allergenListSchema.allow(null),
};

export const { validate: validateChainProduct, isType: isChainProduct } =
  validateSchema<CrudApi.ChainProduct>(chainProductSchema, 'ChainProduct');

export const groupProductSchema: Joi.SchemaMap<CrudApi.GroupProduct> = {
  id: Joi.string().required(),
  parentId: Joi.string().required(),
  chainId: Joi.string().required(),
  groupId: Joi.string().required(),
  isVisible: Joi.boolean().required(),
  tax: Joi.number().required(),
  takeawayTax: Joi.number().allow(null),
  variants: Joi.array().allow(null), // use an exact schema ProductVariant (Covered by #784)
  configSets: Joi.array().allow(null), // use an exact schema ProductConfigSet (Covered by #784)
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const { validate: validateGroupProduct, isType: isGroupProduct } =
  validateSchema<CrudApi.GroupProduct>(groupProductSchema, 'GroupProduct');

export const {
  validate: validateGroupProductList,
  isType: isGroupProductList,
} = validateGqlList<CrudApi.GroupProduct>(
  groupProductSchema,
  'GroupProductList',
);

export const unitProductSchema: Joi.SchemaMap<CrudApi.UnitProduct> = {
  id: Joi.string().required(),
  parentId: Joi.string().required(),
  chainId: Joi.string().required(),
  groupId: Joi.string().required(),
  unitId: Joi.string().required(),
  isVisible: Joi.boolean().required(),
  position: Joi.number().required(),
  variants: Joi.array().allow(null), // use an exact schema ProductVariant (Covered by #784)
  configSets: Joi.array().allow(null), // use an exact schema ProductConfigSet (Covered by #784)
  laneId: Joi.string().allow(null, ''),
  takeaway: Joi.boolean().allow(null),
  supportedServingModes: Joi.array().items(servingModeSchema).required(),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const { validate: validateUnitProduct, isType: isUnitProduct } =
  validateSchema<CrudApi.UnitProduct>(unitProductSchema, 'UnitProduct');

export const { validate: validateUnitProductList, isType: isUnitProductList } =
  validateGqlList<CrudApi.UnitProduct>(unitProductSchema, 'UnitProductList');

export const createUnitProductSchema: Joi.SchemaMap<CrudApi.UnitProduct> = {
  ...unitProductSchema,
  id: Joi.string().allow(null, ''),
  createdAt: null,
  updatedAt: null,
};

export const updateChainProductSchema: Joi.ObjectSchema<CrudApi.ChainProduct> =
  getUpdateSchema(chainProductSchema);
export const updateGroupProductSchema: Joi.ObjectSchema<CrudApi.GroupProduct> =
  getUpdateSchema(groupProductSchema);
export const updateUnitProductSchema: Joi.ObjectSchema<CrudApi.UnitProduct> =
  getUpdateSchema(unitProductSchema);

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
  takeawayTax: groupProductSchema.takeawayTax,
  position: unitProductSchema.position,
  variants: Joi.array().required(), // use an exact schema GeneratedProductVariant (Covered by #784)
  configSets: Joi.array().allow(null), // use an exact schema GeneratedProductConfigSet (Covered by #784)
  supportedServingModes: unitProductSchema.supportedServingModes,
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
