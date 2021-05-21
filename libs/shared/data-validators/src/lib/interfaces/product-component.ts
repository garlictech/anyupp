import * as Joi from 'joi';
import { CrudApi } from 'libs/crud-gql/api/src';

import { validateSchema } from '../validator/validate';
import { localizedItemSchema } from './localized-item';
import { allergenListSchema } from './product';

export const productComponentSetSchema: Joi.SchemaMap<CrudApi.ProductComponentSet> = {
  __typename: Joi.string().valid('ProductComponentSet').optional(),
  id: Joi.string().required(),
  chainId: Joi.string().required(),
  type: Joi.string().required(),
  name: localizedItemSchema.required(),
  description: Joi.string().required(),
  maxSelection: Joi.number().allow(null),
  items: Joi.array().items(Joi.string()).required(),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const {
  validate: validateProductComponentSet,
  isType: isProductComponentSet,
} = validateSchema<Required<CrudApi.ProductComponentSet>>(
  productComponentSetSchema,
  'ProductComponentSet',
);

export const productComponentSchema: Joi.SchemaMap<CrudApi.ProductComponent> = {
  __typename: Joi.string().valid('ProductComponent').optional(),
  id: Joi.string().required(),
  chainId: Joi.string().required(),
  name: localizedItemSchema.required(),
  description: Joi.string().required(),
  allergens: allergenListSchema.allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const {
  validate: validateProductComponent,
  isType: isProductComponent,
} = validateSchema<Required<CrudApi.ProductComponent>>(
  productComponentSchema,
  'ProductComponent',
);
