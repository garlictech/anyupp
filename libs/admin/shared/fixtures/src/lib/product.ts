import { productComponentSetFixture } from '@bgap/shared/fixtures';

import * as CrudApi from '@bgap/crud-gql/api';
import { productFixture } from '@bgap/shared/fixtures';
import { EProductComponentSetType, RequiredId } from '@bgap/shared/types';

import {
  CHAIN_ID_01,
  PRODUCT_COMPONENT_ID_01,
  PRODUCT_COMPONENT_ID_02,
  PRODUCT_COMPONENT_ID_03,
  PRODUCT_COMPONENT_SET_ID_01,
  PRODUCT_COMPONENT_SET_ID_02,
} from '../';
import {
  CHAIN_PRODUCT_ID_01,
  GROUP_ID_01,
  GROUP_PRODUCT_ID_01,
  UNIT_ID_01,
  UNIT_PRODUCT_ID_01,
} from './config';

const prodComponent_01: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_01,
  id: PRODUCT_COMPONENT_ID_01,
};

const prodComponent_02: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_02,
  id: PRODUCT_COMPONENT_ID_02,
};

const prodComponent_03: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_03,
  id: PRODUCT_COMPONENT_ID_03,
};

const prodCompSet_01: RequiredId<CrudApi.CreateProductComponentSetInput> = {
  ...productComponentSetFixture.getComponentSet({
    id: PRODUCT_COMPONENT_SET_ID_01,
    chainId: CHAIN_ID_01,
    itemIds: [prodComponent_01.id, prodComponent_02.id],
  }),
  type: EProductComponentSetType.EXTRAS,
};

const prodCompSet_02: RequiredId<CrudApi.CreateProductComponentSetInput> = {
  ...productComponentSetFixture.getComponentSet({
    id: PRODUCT_COMPONENT_SET_ID_02,
    chainId: CHAIN_ID_01,
    itemIds: [prodComponent_01.id, prodComponent_02.id, prodComponent_03.id],
  }),
  type: EProductComponentSetType.MODIFIER,
};

const prodConfigSet_01: CrudApi.ProductConfigSetInput = {
  position: 1,
  productSetId: prodCompSet_01.id,
  items: [
    {
      position: 1,
      productComponentId: prodCompSet_01.items[0],
      refGroupPrice: 0,
      price: 0,
    },
    {
      position: 2,
      productComponentId: prodCompSet_01.items[1],
      refGroupPrice: 0,
      price: 0,
    },
  ],
};

const prodConfigSet_02: CrudApi.ProductConfigSetInput = {
  position: 2,
  productSetId: prodCompSet_02.id,
  items: [
    {
      position: 1,
      productComponentId: prodCompSet_02.items[0],
      refGroupPrice: 0,
      price: 0,
    },
    {
      position: 2,
      productComponentId: prodCompSet_02.items[1],
      refGroupPrice: 0,
      price: 0,
    },
    {
      position: 3,
      productComponentId: prodCompSet_02.items[2],
      refGroupPrice: 0,
      price: 0,
    },
  ],
};

export const unitProductFixture = {
  ...productFixture.unitProductBase,
  id: UNIT_PRODUCT_ID_01,
  parentId: GROUP_PRODUCT_ID_01,
  unitId: UNIT_ID_01,
  groupId: GROUP_ID_01,
  chainId: CHAIN_ID_01,
  configSets: [prodConfigSet_01, prodConfigSet_02],
};

export const groupProductFixture = {
  ...productFixture.groupProductBase,
  id: GROUP_PRODUCT_ID_01,
  parentId: CHAIN_PRODUCT_ID_01,
  configSets: [prodConfigSet_01, prodConfigSet_02],
};

export const chainProductFixture = {
  ...productFixture.chainProductBase,
  id: CHAIN_PRODUCT_ID_01,
  chainId: CHAIN_ID_01,
  configSets: [prodConfigSet_01, prodConfigSet_02],
};
