import * as Joi from 'joi';
import { validateSchema } from '../validator/validate';
import { localizedItemSchema } from './localized-item';
import { IGroup } from '@bgap/shared/types';

export const groupSchema: Joi.SchemaMap<IGroup> = {
  __typename: Joi.string().valid('Group').optional(),
  id: Joi.string().required(),
  chainId: Joi.string().required(),
  name: Joi.string().required(),
  description: localizedItemSchema.required(),
  currency: Joi.string().required(),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};
export const { validate: validateGroup, isType: isGroup } = validateSchema<
  IGroup
>(groupSchema, 'Group');
