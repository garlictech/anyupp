import * as CrudApi from '@bgap/crud-gql/api';
import { EVariantAvailabilityType, RequiredId } from '@bgap/shared/types';
import { seededIdPrefix, testIdPrefix } from './common';

const unitProductId_seeded_id_01 = `${seededIdPrefix}unit_product_c1_g1_1_id`;
const unitProductId_seeded_id_02 = `${seededIdPrefix}unit_product_c1_g1_2_id`;

const getProductVariant = (
  idx: number,
  type: string,
): RequiredId<CrudApi.ProductVariantInput> => ({
  id: `${testIdPrefix}${type}ProductVariant_id_${idx}`,
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

const chainProductBase: RequiredId<CrudApi.CreateChainProductInput> = {
  id: `${testIdPrefix}chainProduct_id_`,
  chainId: 'chainId_',
  name: { en: 'CHAIN_PRODUCT' },
  description: { en: 'DESCRIPTION' },
  productCategoryId: 'productCategoryId_',
  productType: 'PRODUCT_TYPE',
  isVisible: true,
  image: 'IMAGE',
  variants: [getProductVariant(1, 'chain'), getProductVariant(2, 'chain')],
  allergens: [CrudApi.Allergen.egg, CrudApi.Allergen.gluten],
};

const groupProductBase: RequiredId<CrudApi.CreateGroupProductInput> = {
  id: `${testIdPrefix}generatedProduct_id_`,
  parentId: 'parentId_',
  chainId: 'chainId_',
  groupId: 'groupId_',
  isVisible: true,
  tax: 1,
  variants: [getProductVariant(1, 'group'), getProductVariant(2, 'group')],
};

const unitProductBase: Omit<
  RequiredId<CrudApi.CreateUnitProductInput>,
  'variants'
> & { variants: CrudApi.ProductVariantInput[] } = {
  id: `${testIdPrefix}chainProduct_id_`,
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

export const productFixture = {
  chainProductBase,
  groupProductBase,
  unitProductBase,
  unitProductId_seeded_id_01,
  unitProductId_seeded_id_02,
};
