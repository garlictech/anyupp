import { ILocalizedItem } from './localized-item';

export interface IProductCategory {
  _id: string;
  description: ILocalizedItem<string>;
  image: string;
  name: ILocalizedItem<string>;
  position: string;
}

export interface IProductCategoryOrderChangeEvent {
  change: number;
  productCategoryId: string;
}