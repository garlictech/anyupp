import * as Joi from 'joi';
import * as CrudApi from '@bgap/crud-gql/api';

export const floorMapSchema: Joi.SchemaMap<CrudApi.FloorMapData> = {
  w: Joi.number().required(),
  h: Joi.number().required(),
  objects: Joi.array().items(Joi.object()),
};
