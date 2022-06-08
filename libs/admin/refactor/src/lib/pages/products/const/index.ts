import { ProductType } from '@bgap/domain';
import { KeyValue } from '@bgap/shared/types';

export const PRODUCT_TYPES: KeyValue[] = [
  {
    key: ProductType.drink,
    value: 'products.productType.drink',
  },
  {
    key: ProductType.food,
    value: 'products.productType.food',
  },
  {
    key: ProductType.other,
    value: 'products.productType.other',
  },
];
