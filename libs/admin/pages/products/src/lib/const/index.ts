import { EProductType, IKeyValue } from 'libs/shared/types/src';

export const PRODUCT_TYPES: IKeyValue[] = [
  {
    key: EProductType.DRINK,
    value: 'products.productType.drink',
  },
  {
    key: EProductType.FOOD,
    value: 'products.productType.food',
  },
  {
    key: EProductType.OTHER,
    value: 'products.productType.other',
  },
]