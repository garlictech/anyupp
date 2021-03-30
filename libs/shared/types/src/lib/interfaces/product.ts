import * as Joi from 'joi';
import { EProductType, EVariantAvailabilityType } from '../enums';
import { validateSchema } from '../validation/validate';
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
  position: number;
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
  image: string | null;
  productCategoryId: string;
  isVisible: boolean; // temp
  position: number;
  variants: IProductVariant[];
  tax: string; // %
  laneId?: string;
  productType: EProductType;
  takeaway?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface IUnitProduct {
  __typename?: 'UnitProduct';
  id: string;
  parentId?: string; // parent chainProduct/groupProduct ID
  chainId: string;
  groupId?: string;
  unitId?: string;
  isVisible: boolean; // temp
  position: string;
  variants: IProductVariant[];
  laneId?: string;
  takeaway?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const unitProductSchema: Joi.SchemaMap<IUnitProduct> = {
  __typename: Joi.string().valid('UnitProduct').optional(),
  id: Joi.string().required(),
  parentId: Joi.string().required(),
  chainId: Joi.string().required(),
  groupId: Joi.string().required(),
  unitId: Joi.string().required(),
  isVisible: Joi.boolean().required(),
  position: Joi.string().allow(null),
  variants: Joi.array().required(), //TODO: use an exact schema
  laneId: Joi.string().optional(),
  takeaway: Joi.boolean().allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const {
  validate: validateUnitProduct,
  isType: isUnitProduct,
} = validateSchema<IProduct>(unitProductSchema, 'UnitProduct');

export interface IGeneratedProduct {
  id: string;
  name: ILocalizedItem<string>; // chain edit, group readonly
  description: ILocalizedItem<string>;
  image: string;
  position: number;
  productType: EProductType;
  tax: string;
  variants: IProductVariant[];
  productCategoryId: string;
}

export interface IProductOrderChangeEvent {
  change: number;
  productId: string;
}
