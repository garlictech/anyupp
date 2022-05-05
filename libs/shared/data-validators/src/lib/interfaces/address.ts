import * as Joi from 'joi';
import * as CrudApi from '@bgap/crud-gql/api';
export const latitudeSchema = Joi.number().min(-90).max(90).precision(8);
export const longitudeSchema = Joi.number().min(-180).max(180).precision(8);
export const locationSchema: Joi.SchemaMap<CrudApi.LocationLatLng> = {
  lat: latitudeSchema.required(),
  lng: longitudeSchema.required(),
};
export const addressSchema: Joi.SchemaMap<CrudApi.Address> = {
  location: Joi.object(locationSchema).required(),
};
