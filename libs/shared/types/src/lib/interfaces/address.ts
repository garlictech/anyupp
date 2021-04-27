export interface ILocation {
  __typename?: 'Location';
  lat: number;
  lng: number;
}

export interface IAddress {
  __typename?: 'Address';
  address: string;
  city: string;
  country: string;
  title?: string;
  postalCode: string;
  location: ILocation;
}

export interface IAddressInfo {
  address: IAddress;
}
