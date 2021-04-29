import { CrudApi } from '@bgap/crud-gql/api';
import { EVariantAvailabilityType } from '@bgap/shared/types';

const unitProductId_seeded_id = 'unit_product_c1_g1_1_id_seeded';

const getProductVariant = (
  idx: number,
  type: string,
): CrudApi.ProductVariantInput => ({
  id: `${type}ProductVariant_id_${idx}`,
  variantName: { en: `VARIANT_NAME_${idx}` },
  refGroupPrice: idx,
  isAvailable: true,
  pack: { size: idx, unit: 'UNIT' },
  price: idx,
  availabilities: [
    {
      dayFrom: '',
      dayTo: '',
      price: idx * 1.5,
      timeFrom: '',
      timeTo: '',
      type: EVariantAvailabilityType.ALWAYS,
    },
  ],
  position: idx,
});

export const chainProductBase: CrudApi.CreateChainProductInput = {
  id: 'chainProduct_id_',
  chainId: 'chainId_',
  name: { en: 'CHAIN_PRODUCT' },
  description: { en: 'DESCRIPTION' },
  productCategoryId: 'productCategoryId_',
  productType: 'PRODUCT_TYPE',
  isVisible: true,
  image: 'IMAGE',
  variants: [getProductVariant(1, 'chain'), getProductVariant(2, 'chain')],
};

export const groupProductBase: CrudApi.CreateGroupProductInput = {
  id: 'generatedProduct_id_',
  parentId: 'parentId_',
  chainId: 'chainId_',
  groupId: 'groupId_',
  isVisible: true,
  tax: 1,
  variants: [getProductVariant(1, 'group'), getProductVariant(2, 'group')],
};

export const unitProductBase: CrudApi.CreateUnitProductInput = {
  id: 'chainProduct_id_',
  parentId: 'parentId_',
  chainId: 'chainId_',
  groupId: 'groupId_',
  unitId: 'unitId_',
  isVisible: true,
  takeaway: true,
  laneId: 'laneId_',
  position: 1,
  variants: [getProductVariant(1, 'chain'), getProductVariant(2, 'chain')],
};

export const productSeed = {
  chainProductBase,
  groupProductBase,
  unitProductBase,
  unitProductId_seeded_id,
};
