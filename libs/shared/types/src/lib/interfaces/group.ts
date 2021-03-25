import * as Joi from 'joi';
import { validateSchema } from '../validation/validate';
import { IAddressInfo } from './address';
import { IContact } from './contact';
import { ILocalizedItem, localizedItemSchema } from './localized-item';

export interface IGroup extends IContact, IAddressInfo {
  __typename?: 'Group';
  id: string;
  chainId: string;
  name: string;
  description: ILocalizedItem<string>;
  currency: string; // group edit, unit readonly
  createdAt: string;
  updatedAt: string;
}

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
