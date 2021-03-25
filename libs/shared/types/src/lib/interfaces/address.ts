import * as Joi from 'joi';

export interface ILocation {
  __typename?: 'Location';
  lat: number;
  lng: number;
}

export const locationSchema: Joi.SchemaMap<ILocation> = {
  __typename: Joi.string().valid('Location').optional(),
  lat: Joi.number(),
  lng: Joi.number(),
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
