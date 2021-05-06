import * as CrudApi from '@bgap/crud-gql/api';
import { chainSeed } from './chain';
import { groupSeed } from './group';
import { unitSeed } from './unit';

const unitProductId_01 = 'unit_product_1_id';
const unitProductId_seeded = 'unit_product_c1_g1_1_id';

const variant: CrudApi.ProductVariantInput = {
  id: 'VARIANT_ID',
  isAvailable: true,
  price: 11,
  position: 1,
  pack: {
    size: 2,
    unit: 'dl',
  },
  variantName: {
    en: 'glass',
    hu: 'pohár',
  },
  availabilities: [
    {
      dayFrom: '',
      dayTo: '',
      price: 60,
      timeFrom: '',
      timeTo: '',
      type: 'A',
    },
  ],
};

const unitProduct_01: CrudApi.CreateUnitProductInput = {
  id: unitProductId_01,
  parentId: 'PARENT_ID',
  chainId: chainSeed.chainId_seeded_01,
  groupId: groupSeed.groupId_seeded_01,
  unitId: unitSeed.unitId_seeded_01,
  // laneId:
  isVisible: true,
  takeaway: false,
  position: 0,
  variants: [variant],
};

export const unitProductSeed = {
  unitProductId_seeded,
  unitProduct_01,
};
