import * as Joi from 'joi';
import { IAddress, ILocation } from '@bgap/shared/types';
export const latitudeSchema = Joi.number().min(-90).max(90).precision(8);
export const longitudeSchema = Joi.number().min(-180).max(180).precision(8);
export const locationSchema: Joi.SchemaMap<ILocation> = {
  lat: latitudeSchema.required(),
  lng: longitudeSchema.required(),
};
export const addressSchema: Joi.SchemaMap<IAddress> = {
  location: Joi.object(locationSchema).required(),
};
