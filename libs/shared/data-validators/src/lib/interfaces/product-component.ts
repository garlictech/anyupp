import * as CrudApi from '@bgap/crud-gql/api';
import * as Joi from 'joi';
import { validateGqlList, validateSchema } from '../validator/validate';
import { localizedItemSchema } from './localized-item';
import { allergenListSchema } from './product';

export const productComponentSetSchema: Joi.SchemaMap<CrudApi.ProductComponentSet> =
  {
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

export const {
  validate: validateProductComponentSetList,
  isType: isProductComponentSetList,
} = validateGqlList<CrudApi.ProductComponentSet>(
  productComponentSetSchema,
  'ProductComponentSetList',
);

export const productComponentSchema: Joi.SchemaMap<CrudApi.ProductComponent> = {
  id: Joi.string().required(),
  chainId: Joi.string().required(),
  name: localizedItemSchema.required(),
  description: Joi.string().allow(null, ''),
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

export const {
  validate: validateProductComponentList,
  isType: isProductComponentList,
} = validateGqlList<CrudApi.ProductComponent>(
  productComponentSchema,
  'ProductComponentList',
);
