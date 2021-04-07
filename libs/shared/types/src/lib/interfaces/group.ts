import { IAddressInfo } from './address';
import { IContact } from './contact';
import { ILocalizedItem } from './localized-item';

export interface IGroup extends IContact, IAddressInfo {
  __typename?: 'Group';
  id: string;
  chainId: string;
  name: string;
  description: ILocalizedItem<string>;
  currency: string; // group edit, unit readonly
  createdAt: string;
  updatedAt: string;
}
