export interface IAddress {
  address: string;
  city: string;
  country: string;
  title: string;
  postalCode: string;
  location: ILocation;
}

export interface ILocation {
  lat: number;
  lng: number;
}
