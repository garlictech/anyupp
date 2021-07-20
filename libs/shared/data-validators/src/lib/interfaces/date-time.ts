import * as Joi from 'joi';

export const dateStringSchema = Joi.string().pattern(
  /^([1-9][0-9]{3})-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01])$/,
  'YYYY-MM-DD format',
);
export const timeStringSchema = Joi.string().pattern(
  /^(?:\d|[01]\d|2[0-3]):[0-5]\d$/,
  'HH:MM format',
);
