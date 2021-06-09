import * as Joi from 'joi';

import * as CrudApi from '@bgap/crud-gql/api';

import { validateSchema } from '../validator/validate';
import { addressSchema } from './address';
import { contactSchema } from './contact';
import { localizedItemSchema } from './localized-item';

export const groupSchema: Joi.SchemaMap<CrudApi.Group> = {
  id: Joi.string().required(),
  chainId: Joi.string().required(),
  name: Joi.string().required(),
  description: localizedItemSchema.required(),
  currency: Joi.string().required(),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
  address: Joi.object(addressSchema).allow(null),
  ...contactSchema,
};
export const { validate: validateGroup, isType: isGroup } =
  validateSchema<CrudApi.Group>(groupSchema, 'Group');
