import {
  ProductComponent,
  ProductComponentSet,
  Variant,
  UnitProduct,
} from '@bgap/domain';

export interface Allergen {
  id: string;
  idx: number;
}

export interface ProductOrderChangeEvent {
  change: number;
  productId: string;
}

export type ProductVariantWithPrice = Omit<Variant, 'price'> &
  Required<Pick<Variant, 'price'>>;

export type MergedProductWithPrices = Omit<UnitProduct, 'variants'> & {
  variants: ProductVariantWithPrice[];
};

export interface ProductComponentSetMap {
  [key: string]: Required<ProductComponentSet>;
}

export interface ProductComponentMap {
  [key: string]: Required<ProductComponent>;
}

export interface Product extends Partial<UnitProduct> {
  pending?: boolean;
}
