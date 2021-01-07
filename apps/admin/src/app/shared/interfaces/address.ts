import { ILocation } from './unit';

export interface IAddress {
  address: string;
  city: string;
  country: string;
  title: string;
  postalCode: string;
  location: ILocation;
}
