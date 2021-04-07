import * as Joi from 'joi';

import { IAddressInfo, addressSchema } from './address';
import { IContact, contactSchema } from './contact';
import { ILocalizedItem, localizedItemSchema } from './localized-item';
import { validateSchema } from '../validation/validate';

export interface IChainStyle {
  __typename?: 'ChainStyle';
  colors: {
    backgroundLight: string;
    backgroundDark: string;
    borderLight: string;
    borderDark: string;
    disabled: string;
    highlight: string;
    indicator: string;
    textLight: string;
    textDark: string;
  };
  images?: {
    header: string;
    logo: string;
  };
}
export const chainStyleSchema: Joi.SchemaMap<IChainStyle> = {
  __typename: Joi.string().valid('ChainStyle').optional(),
  colors: Joi.object().required(),
  images: Joi.object().allow(null),
};

export interface IChain extends IContact, IAddressInfo {
  __typename?: 'Chain';
  id: string;
  name: string;
  description: ILocalizedItem<string>;
  style: IChainStyle;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export const chainSchema: Joi.SchemaMap<IChain> = {
  __typename: Joi.string().valid('Chain').optional(),
  id: Joi.string().required(),
  isActive: Joi.boolean().required(),
  name: Joi.string().required(),
  description: localizedItemSchema.required(),
  style: Joi.object(chainStyleSchema).required(),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
  address: Joi.object(addressSchema).allow(null),
  ...contactSchema,
};

export const { validate: validateChain, isType: isChain } = validateSchema<
  IChain
>(chainSchema, 'Chain');
