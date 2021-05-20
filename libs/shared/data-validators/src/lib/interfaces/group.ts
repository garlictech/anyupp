import * as Joi from 'joi';
import { validateSchema } from '../validator/validate';
import { localizedItemSchema } from './localized-item';
import * as CrudApi from '@bgap/crud-gql/api';

export const groupSchema: Joi.SchemaMap<CrudApi.Group> = {
  id: Joi.string().required(),
  chainId: Joi.string().required(),
  name: Joi.string().required(),
  description: localizedItemSchema.required(),
  currency: Joi.string().required(),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};
export const { validate: validateGroup, isType: isGroup } = validateSchema<
  CrudApi.Group
>(groupSchema, 'Group');
