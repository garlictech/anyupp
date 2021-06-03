import * as Joi from 'joi';
import { IAddress, IAddressInfo, ILocation } from '@bgap/shared/types';
export const latitudeSchema = Joi.number().min(-90).max(90).precision(8);
export const longitudeSchema = Joi.number().min(-180).max(180).precision(8);
export const locationSchema: Joi.SchemaMap<ILocation> = {
  lat: latitudeSchema.required(),
  lng: longitudeSchema.required(),
};
export const addressSchema: Joi.SchemaMap<IAddress> = {
  address: Joi.string().required(),
  city: Joi.string().required(),
  country: Joi.string().required(),
  title: Joi.string().allow(null, ''),
  postalCode: Joi.string().required(),
  location: Joi.object(locationSchema).required(),
};
export const addressInfoSchema: Joi.SchemaMap<IAddressInfo> = {
  address: Joi.object(addressSchema).required(),
};
