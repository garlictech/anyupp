import { IAddress } from './address';

export interface IContact {
  address?: IAddress;
  email?: string;
  phone?: string;
}
