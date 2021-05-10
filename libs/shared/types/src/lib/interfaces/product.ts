import { CrudApi } from '@bgap/crud-gql/api';

import { EProductType, EVariantAvailabilityType } from '../enums';
import { ILocalizedItem } from './localized-item';

export interface IAllergen {
  id: string;
  idx: number;
}

export interface IAvailability {
  type: EVariantAvailabilityType;
  dayFrom: string;
  dayTo?: string;
  timeFrom?: string;
  timeTo?: string;
  price: number;
}

export interface IProductVariantPack {
  size: number;
  unit: string;
}

export interface IProductVariant {
  id: string;
  variantName: ILocalizedItem<string>;
  pack: IProductVariantPack;
  refGroupPrice: number;
  isAvailable: boolean;
  price?: number; // generated
  availabilities: IAvailability[]; // unit edit
  // availableFrom: Date;
  position: number;
}

export interface IProductConfigComponent {
  productComponentId: string;
  refGroupPrice?: number;
  price?: number;
  position: number;
}

export interface IProductConfigSet {
  productSetId: string;
  items: IProductConfigComponent[];
  position: number;
}

export interface IGeneratedProductVariant {
  id: string;
  variantName: ILocalizedItem<string>;
  price: number;
  position: number;
  pack: IProductVariantPack;
}

export interface IGeneratedProduct {
  id: string; // UnitProductId
  unitId: string;
  name: ILocalizedItem<string>; // chain edit, group readonly
  description: ILocalizedItem<string>;
  image: string;
  position: number;
  productType: EProductType;
  tax: number;
  variants: IGeneratedProductVariant[];
  productCategoryId: string;
  allergens?: CrudApi.Allergen[];
  createdAt?: string;
  updatedAt?: string;
}

export interface IProduct {
  id: string;
  parentId?: string; // parent chainProduct/groupProduct ID
  chainId: string;
  groupId?: string;
  unitId?: string;
  extends?: string;
  name: ILocalizedItem<string>; // chain edit, group readonly
  description: ILocalizedItem<string>;
  image?: string;
  productCategoryId: string;
  isVisible: boolean; // temp
  position: number;
  variants: IProductVariant[];
  allergens?: CrudApi.Allergen[];
  configSets?: IProductConfigSet[];
  tax: number; // %
  laneId?: string;
  productType: EProductType;
  takeaway?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUnitProduct {
  __typename?: 'UnitProduct';
  id: string;
  parentId: string; // parent chainProduct/groupProduct ID
  chainId: string;
  groupId: string;
  unitId: string;
  isVisible: boolean; // temp
  position: number;
  variants: IProductVariant[];
  configSets?: IProductConfigSet[];
  laneId?: string;
  takeaway?: boolean;
  groupProduct: IGroupProduct;
  createdAt: string;
  updatedAt: string;
}

export interface IChainProduct {
  __typename?: 'ChainProduct';
  id: string;
  chainId: string;
  name: ILocalizedItem<string>;
  description: ILocalizedItem<string>;
  productCategoryId: string;
  productType: EProductType;
  isVisible: boolean;
  image?: string;
  variants: IProductVariant[];
  configSets?: IProductConfigSet[];
  createdAt: string;
  updatedAt: string;
  allergens?: CrudApi.Allergen[];
}

export interface IGroupProduct {
  __typename?: 'GroupProduct';
  id: string;
  parentId: string;
  chainId: string;
  groupId: string;
  isVisible: boolean;
  tax: number;
  variants: IProductVariant[];
  configSets?: IProductConfigSet[];
  chainProduct: IChainProduct;
  createdAt: string;
  updatedAt: string;
}

export interface IProductOrderChangeEvent {
  change: number;
  productId: string;
}

// export interface IGeneratedProductVariantsMap {
//   [key: string]: IGeneratedProductVariant;
// }

// export interface IMergedProduct {
//   productCategoryId: string;
//   isVisible: boolean;
//   variants: IProductVariant[];
//   name: ILocalizedItem<string>;
//   description: ILocalizedItem<string>;
//   image: string;
//   tax: number;
//   position: number;
//   productType: string;
// }
