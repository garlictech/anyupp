import { EProductType, EVariantAvailabilityType } from '../enums';
import { ILocalizedItem } from './localized-item';

export interface IAllergen {
  lactose: boolean;
  nuts: boolean;
}

export interface IAvailability {
  type: EVariantAvailabilityType;
  dayFrom: string;
  dayTo?: string;
  timeFrom?: string;
  timeTo?: string;
  price: number;
}

export interface IProductIngredients {
  alcohol: number;
  allergens: IAllergen;
  caffeine: number;
}

export interface IProductVariantPack {
  size: number;
  unit: string;
}

export interface IProductVariant {
  id?: string;
  variantName: ILocalizedItem<string>;
  pack: IProductVariantPack;
  refGroupPrice: number;
  isAvailable: boolean;
  price?: number; // generated
  availabilities: IAvailability[]; // unit edit
  availableFrom: Date;
  position: string;
}

export interface IProduct {
  id: string;
  extends?: string;
  name: ILocalizedItem<string>; // chain edit, group readonly
  description: ILocalizedItem<string>;
  image: string;
  productCategoryId: string;
  isVisible: boolean; // temp
  // contains: any; // TODO interface
  position: string;
  variants: IProductVariant[];
  // alwaysAvailableOnOpen: boolean; // TODO
  // ingredients: IProductIngredients; // TODO later...
  tax: string; // %
  laneId?: string;
  productType: EProductType;
}

export interface IGeneratedProduct {
  id: string;
  name: ILocalizedItem<string>; // chain edit, group readonly
  description: ILocalizedItem<string>;
  image: string;
  position: string;
  productType: EProductType;
  tax: string;
  variants: IProductVariant[];
  productCategoryId: string;
}

export interface IProductOrderChangeEvent {
  change: number;
  productId: string;
}
