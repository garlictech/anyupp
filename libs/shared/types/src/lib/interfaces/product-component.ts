import { ILocalizedItem } from './localized-item';

export interface IProductComponent {
  id: string;
  chainId: string;
  name: ILocalizedItem<string>;
  description: string;
  allergens: string[];
}
