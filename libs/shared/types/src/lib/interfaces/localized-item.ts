import * as Joi from 'joi';

export interface ILocalizedItem<T> {
  [lang: string]: T;
}

export const localizedItemSchema = Joi.object();
