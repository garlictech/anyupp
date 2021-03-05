import { IAddressInfo } from './address';
import { IContact } from './contact';
import { ILocalizedItem } from './localized-item';

export interface IGroup extends IContact, IAddressInfo {
  id: string;
  chainId: string;
  name: string;
  description: ILocalizedItem<string>;
  currency: string; // group edit, unit readonly
}
