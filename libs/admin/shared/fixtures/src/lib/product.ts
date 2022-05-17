/*
import { productComponentSetFixture } from '@bgap/shared/fixtures';

import * as CrudApi from '@bgap/crud-gql/api';
import { productFixture } from '@bgap/shared/fixtures';
import { RequiredId } from '@bgap/shared/types';

import {
  CHAIN_ID_01,
  PRODUCT_COMPONENT_ID_11,
  PRODUCT_COMPONENT_ID_21,
  PRODUCT_COMPONENT_ID_31,
  PRODUCT_COMPONENT_SET_ID_01,
  PRODUCT_COMPONENT_SET_ID_02,
} from '../';
import {
  CHAIN_PRODUCT_ID_01,
  GROUP_ID_01,
  GROUP_PRODUCT_ID_01,
  PRODUCT_COMPONENT_ID_12,
  PRODUCT_COMPONENT_ID_22,
  PRODUCT_COMPONENT_ID_32,
  PRODUCT_COMPONENT_ID_33,
  PRODUCT_COMPONENT_SET_ID_03,
  UNIT_ID_01,
  UNIT_PRODUCT_ID_01,
} from './config';

const prodComponent_11: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_11,
  id: PRODUCT_COMPONENT_ID_11,
};
const prodComponent_12: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_12,
  id: PRODUCT_COMPONENT_ID_12,
};

const prodComponent_21: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_21,
  id: PRODUCT_COMPONENT_ID_21,
};

const prodComponent_22: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_22,
  id: PRODUCT_COMPONENT_ID_22,
};

const prodComponent_31: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_31,
  id: PRODUCT_COMPONENT_ID_31,
};

const prodComponent_32: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_32,
  id: PRODUCT_COMPONENT_ID_32,
};

const prodComponent_33: RequiredId<CrudApi.CreateProductComponentInput> = {
  ...productComponentSetFixture.seededProdComp_33,
  id: PRODUCT_COMPONENT_ID_33,
};

const prodCompSet_01: RequiredId<CrudApi.CreateProductComponentSetInput> = {
  ...productComponentSetFixture.getComponentSet({
    id: PRODUCT_COMPONENT_SET_ID_01,
    chainId: CHAIN_ID_01,
    itemIds: [prodComponent_11.id, prodComponent_12.id],
  }),
  type: CrudApi.ProductComponentSetType.extras,
};

const prodCompSet_02: RequiredId<CrudApi.CreateProductComponentSetInput> = {
  ...productComponentSetFixture.getComponentSet({
    id: PRODUCT_COMPONENT_SET_ID_02,
    chainId: CHAIN_ID_01,
    itemIds: [prodComponent_21.id, prodComponent_22.id],
  }),
  type: CrudApi.ProductComponentSetType.modifier,
};

const prodCompSet_03: RequiredId<CrudApi.CreateProductComponentSetInput> = {
  ...productComponentSetFixture.getComponentSet({
    id: PRODUCT_COMPONENT_SET_ID_03,
    chainId: CHAIN_ID_01,
    itemIds: [prodComponent_31.id, prodComponent_32.id, prodComponent_33.id],
  }),
  type: CrudApi.ProductComponentSetType.modifier,
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
  ],
};

const prodConfigSet_03: CrudApi.ProductConfigSetInput = {
  position: 3,
  productSetId: prodCompSet_03.id,
  items: [
    {
      position: 1,
      productComponentId: prodCompSet_03.items[0],
      refGroupPrice: 0,
      price: 0,
    },
    {
      position: 2,
      productComponentId: prodCompSet_03.items[1],
      refGroupPrice: 0,
      price: 0,
    },
    {
      position: 3,
      productComponentId: prodCompSet_03.items[2],
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
  configSets: [prodConfigSet_01, prodConfigSet_02, prodConfigSet_03],
};

export const groupProductFixture = {
  ...productFixture.groupProductBase,
  id: GROUP_PRODUCT_ID_01,
  parentId: CHAIN_PRODUCT_ID_01,
  configSets: [prodConfigSet_01, prodConfigSet_02, prodConfigSet_03],
};

export const chainProductFixture = {
  ...productFixture.chainProductBase,
  id: CHAIN_PRODUCT_ID_01,
  chainId: CHAIN_ID_01,
  configSets: [prodConfigSet_01, prodConfigSet_02, prodConfigSet_03],
};
*/
