import { EProductComponentSetType } from '../enums';
import { ILocalizedItem } from './localized-item';

export interface IProductComponentSet {
  id: string;
  chainId: string;
  type: EProductComponentSetType;
  name: ILocalizedItem<string>;
  description: string;
  items: string[];
  maxSelection?: number;
}
