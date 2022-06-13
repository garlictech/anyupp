import {
  ChainProduct,
  GroupProduct,
  ProductComponent,
  ProductComponentSet,
  ProductVariant,
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

export type MergedProduct = ChainProduct & GroupProduct & UnitProduct;

export type ProductVariantWithPrice = Omit<ProductVariant, 'price'> &
  Required<Pick<ProductVariant, 'price'>>;

export type MergedProductWithPrices = Omit<MergedProduct, 'variants'> & {
  variants: ProductVariantWithPrice[];
};

export interface ProductComponentSetMap {
  [key: string]: Required<ProductComponentSet>;
}

export interface ProductComponentMap {
  [key: string]: Required<ProductComponent>;
}

export interface Product
  extends Partial<ChainProduct>,
    Partial<GroupProduct>,
    Partial<UnitProduct> {
  pending?: boolean;
}
