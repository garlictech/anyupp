import * as Joi from 'joi';

const getFieldnamesButId = (schemaMap: Joi.PartialSchemaMap<unknown>) =>
  Object.keys(schemaMap).filter(field => field !== 'id');

export const getUpdateSchema = (schemaMap: Joi.PartialSchemaMap<unknown>) =>
  Joi.object(schemaMap).fork(getFieldnamesButId(schemaMap), schema =>
    schema.optional(),
  );
