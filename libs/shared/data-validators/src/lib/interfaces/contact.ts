import * as Joi from 'joi';
import {
  IContact,
} from '@bgap/shared/types';

export const contactSchema: Joi.SchemaMap<IContact> = {
  email: Joi.string().allow(null),
  phone: Joi.string().allow(null),
};
