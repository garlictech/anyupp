import * as Joi from 'joi';
import { IFloorMapData } from '@bgap/shared/types';

export const floorMapSchema: Joi.SchemaMap<IFloorMapData> = {
  __typename: Joi.string().valid('FloorMapData').optional(),
  w: Joi.number().required(),
  h: Joi.number().required(),
  objects: Joi.array().items(Joi.object()),
};
