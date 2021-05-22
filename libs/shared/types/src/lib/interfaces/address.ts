export interface ILocation {
  lat: number;
  lng: number;
}

export interface IAddress {
  address: string;
  city: string;
  country: string;
  title: string;
  postalCode: string;
  location: ILocation;
}

export interface IAddressInfo {
  address: IAddress;
}
