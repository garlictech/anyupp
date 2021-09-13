import * as CrudApi from '@bgap/crud-gql/api';
import { EVariantAvailabilityType, RequiredId } from '@bgap/shared/types';
import { seededIdPrefix, testIdPrefix } from './common';

const unitProductId_seeded_id_01 = `${seededIdPrefix}unit_product_c1_g1_1_id`;
const unitProductId_seeded_id_02 = `${seededIdPrefix}unit_product_c1_g1_2_id`;

const getChainProductVariant = (
  idx: number,
): RequiredId<CrudApi.ProductVariantInput> => ({
  id: `${testIdPrefix}ChainProductVariant_id_${idx}`,
  variantName: { en: `VARIANT_NAME_${idx}` },
  refGroupPrice: idx * 10,
  isAvailable: true,
  pack: { size: idx, unit: `CHAIN_UNIT` },
  price: idx * 10,
  availabilities: [
    {
      dayFrom: '',
      dayTo: '',
      price: idx * 0.5,
      timeFrom: '',
      timeTo: '',
      type: EVariantAvailabilityType.ALWAYS,
    },
  ],
  position: idx,
});
const getGroupProductVariant = (
  idx: number,
): RequiredId<CrudApi.ProductVariantInput> => ({
  id: `${testIdPrefix}GroupProductVariant_id_${idx}`,
  variantName: { en: `VARIANT_NAME_${idx}` },
  refGroupPrice: idx * 20,
  isAvailable: true,
  pack: { size: idx, unit: `GROUP_UNIT` },
  price: idx * 20,
  availabilities: [
    {
      dayFrom: '',
      dayTo: '',
      price: idx * 1,
      timeFrom: '',
      timeTo: '',
      type: EVariantAvailabilityType.ALWAYS,
    },
  ],
  position: idx,
});
const getUnitProductVariant = (
  idx: number,
): RequiredId<CrudApi.ProductVariantInput> => ({
  id: `${testIdPrefix}UnitProductVariant_id_${idx}`,
  variantName: { en: `VARIANT_NAME_${idx}` },
  refGroupPrice: idx * 30,
  isAvailable: true,
  pack: { size: idx, unit: `UNIT_UNIT` },
  price: idx * 30,
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
  variants: [getChainProductVariant(1), getChainProductVariant(2)],
  allergens: [CrudApi.Allergen.egg, CrudApi.Allergen.gluten],
};

const groupProductBase: RequiredId<CrudApi.CreateGroupProductInput> = {
  id: `${testIdPrefix}generatedProduct_id_`,
  parentId: 'parentId_',
  chainId: 'chainId_',
  groupId: 'groupId_',
  isVisible: true,
  tax: 1,
  variants: [getGroupProductVariant(1), getGroupProductVariant(2)],
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
  variants: [getUnitProductVariant(1), getUnitProductVariant(2)],
  supportedServingModes: [CrudApi.ServingMode.takeaway],
};

export const productFixture = {
  chainProductBase,
  groupProductBase,
  unitProductBase,
  unitProductId_seeded_id_01,
  unitProductId_seeded_id_02,
};
