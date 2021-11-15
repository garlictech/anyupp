import * as CrudApi from '@bgap/crud-gql/api';

export interface Allergen {
  id: string;
  idx: number;
}

export interface ProductOrderChangeEvent {
  change: number;
  productId: string;
}

export type MergedProduct = CrudApi.ChainProduct &
  CrudApi.GroupProduct &
  CrudApi.UnitProduct;

export type ProductVariantWithPrice = Omit<CrudApi.ProductVariant, 'price'> &
  Required<Pick<CrudApi.ProductVariant, 'price'>>;

export type MergedProductWithPrices = Omit<MergedProduct, 'variants'> & {
  variants: ProductVariantWithPrice[];
};

export interface ProductComponentSetMap {
  [key: string]: Required<CrudApi.ProductComponentSet>;
}

export interface ProductComponentMap {
  [key: string]: Required<CrudApi.ProductComponent>;
}

export interface Product
  extends Partial<CrudApi.ChainProduct>,
    Partial<CrudApi.GroupProduct>,
    Partial<CrudApi.UnitProduct> {}
