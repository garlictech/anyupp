import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue } from '@bgap/shared/types';

export const PRODUCT_TYPES: KeyValue[] = [
  {
    key: CrudApi.ProductType.drink,
    value: 'products.productType.drink',
  },
  {
    key: CrudApi.ProductType.food,
    value: 'products.productType.food',
  },
  {
    key: CrudApi.ProductType.other,
    value: 'products.productType.other',
  },
];
