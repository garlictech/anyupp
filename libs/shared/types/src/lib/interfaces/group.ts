import Joi from 'joi';
import { validateSchema } from '../validation/validate';
import { IAddressInfo } from './address';
import { IContact } from './contact';
import { ILocalizedItem } from './localized-item';

export interface IGroup extends IContact, IAddressInfo {
  id: string;
  chainId: string;
  name: string;
  description: ILocalizedItem<string>;
  currency: string; // group edit, unit readonly
}

export const groupSchema: Joi.SchemaMap = {
  __typename: Joi.string().valid('Group').optional(),
  id: Joi.string().required(),
  groupId: Joi.string().required(),
  chainId: Joi.string().required(),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};
export const { validate: validateGroup, isType: isGroup } = validateSchema<
  IGroup
>(groupSchema, 'Group');
