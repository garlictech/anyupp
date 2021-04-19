import * as Joi from 'joi';
import { IAddress, IAddressInfo, ILocation } from '@bgap/shared/types';
export const latitudeSchema = Joi.number().min(-90).max(90).precision(8);
export const longitudeSchema = Joi.number().min(-180).max(180).precision(8);
export const locationSchema: Joi.SchemaMap<ILocation> = {
  __typename: Joi.string().valid('Location').optional(),
  lat: latitudeSchema.required(),
  lng: longitudeSchema.required(),
};
export const addressSchema: Joi.SchemaMap<IAddress> = {
  __typename: Joi.string().valid('Address').optional(),
  address: Joi.string().allow(null),
  city: Joi.string().allow(null),
  country: Joi.string().allow(null),
  title: Joi.string().allow(null),
  postalCode: Joi.string().allow(null),
  location: Joi.object(locationSchema).allow(null),
};
export const addressInfoSchema: Joi.SchemaMap<IAddressInfo> = {
  address: Joi.object(addressSchema).required(),
};
