import { ILocalizedItem } from './localized-item';

export interface IProductCategory {
  id: string;
  chainId: string;
  description: ILocalizedItem<string>;
  image: string | null;
  name: ILocalizedItem<string>;
  position: number;
}

export interface IProductCategoryOrderChangeEvent {
  change: number;
  productCategoryId: string;
}
