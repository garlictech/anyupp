import { EVariantAvailabilityType } from '@bgap/shared/types';
import { CreateUnitProductInput, ProductType, ServingMode } from '@bgap/domain';
import { seededIdPrefix, testIdPrefix } from './common';

const unitProductId_seeded_id_01 = `${seededIdPrefix}unit_product_1_id`;
const unitProductId_seeded_id_02 = `${seededIdPrefix}unit_product_2_id`;

const getUnitProductVariant = (idx: number) => ({
  id: `${testIdPrefix}UnitProductVariant_id_${idx}`,
  variantName: { en: `VARIANT_NAME_${idx}` },
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
  netPackagingFee: 400,
  soldOut: true,
});

const unitProductInputBase: CreateUnitProductInput = {
  id: `${testIdPrefix}chainProduct_id_`,
  unitId: 'unitId_',
  isVisible: true,
  takeaway: true,
  laneId: 'laneId_',
  position: 1,
  variants: [getUnitProductVariant(1), getUnitProductVariant(2)],
  supportedServingModes: [ServingMode.takeaway],
  name: { en: 'PRODUCT NAME' },
  productCategoryId: 'NOT GIVEN',
  tax: 0,
  productType: ProductType.dish,
};

const unitProductBase = {
  ...unitProductInputBase,
  createdAt: '2021-08-17T15:13:47.532Z',
  updatedAt: '2021-08-17T15:14:05.132Z',
};

export const productFixture = {
  unitProductBase,
  unitProductInputBase,
  unitProductId_seeded_id_01,
  unitProductId_seeded_id_02,
};
