import * as Joi from 'joi';

export interface IContact {
  email?: string;
  phone?: string;
}

export const contactSchema: Joi.SchemaMap<IContact> = {
  email: Joi.string().allow(null),
  phone: Joi.string().allow(null),
};
