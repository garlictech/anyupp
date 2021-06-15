import * as CrudApi from '@bgap/crud-gql/api';
import * as Joi from 'joi';
import { validateGqlList, validateSchema } from '../validator/validate';
import { localizedItemSchema } from './localized-item';

export const productCategorySchema: Joi.SchemaMap<CrudApi.ProductCategory> = {
  id: Joi.string().required(),
  chainId: Joi.string().required(),
  name: localizedItemSchema.required(),
  description: localizedItemSchema.allow(null),
  image: Joi.string().allow(null, ''),
  position: Joi.number().required(),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const { validate: validateProductCategory, isType: isProductCategory } =
  validateSchema<CrudApi.ProductCategory>(
    productCategorySchema,
    'ProductCategory',
  );

export const {
  validate: validateProductCategoryList,
  isType: isProductCategoryList,
} = validateGqlList<CrudApi.ProductCategory>(
  productCategorySchema,
  'ProductCategoryList',
);

export const generatedProductCategorySchema: Joi.SchemaMap<CrudApi.GeneratedProductCategory> =
  {
    id: Joi.string().required(),
    unitId: Joi.string().required(),
    productNum: Joi.number().required(),
    productCategoryId: Joi.string().required(),
    productCategory: Joi.object(productCategorySchema).required(),
    createdAt: Joi.string().required(),
    updatedAt: Joi.string().required(),
  };

export const {
  validate: validateGeneratedProductCategory,
  isType: isGeneratedProductCategory,
} = validateSchema<CrudApi.GeneratedProductCategory>(
  generatedProductCategorySchema,
  'GeneratedProductCategory',
);

export const {
  validate: validateGeneratedProductCategoryList,
  isType: isGeneratedProductCategoryList,
} = validateGqlList<CrudApi.GeneratedProductCategory>(
  generatedProductCategorySchema,
  'GeneratedProductCategoryList',
);
