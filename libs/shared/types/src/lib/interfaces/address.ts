import * as Joi from 'joi';

export const latitudeSchema = Joi.number().min(-90).max(90).precision(8);
export const longitudeSchema = Joi.number().min(-180).max(180).precision(8);

export interface ILocation {
  __typename?: 'Location';
  lat: number;
  lng: number;
}

export const locationSchema: Joi.SchemaMap<ILocation> = {
  __typename: Joi.string().valid('Location').optional(),
  lat: latitudeSchema,
  lng: longitudeSchema,
};

export interface IAddress {
  __typename?: 'Address';
  address: string;
  city: string;
  country: string;
  title: string;
  postalCode: string;
  location: ILocation;
}

export const addressSchema: Joi.SchemaMap<IAddress> = {
  __typename: Joi.string().valid('Address').optional(),
  address: Joi.string(),
  city: Joi.string(),
  country: Joi.string(),
  title: Joi.string(),
  postalCode: Joi.string(),
  location: Joi.object(locationSchema),
};

export interface IAddressInfo {
  address: IAddress;
}

export const addressInfoSchema: Joi.SchemaMap<IAddressInfo> = {
  address: Joi.object(addressSchema).required(),
};
