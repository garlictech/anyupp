import * as CrudApi from '@bgap/crud-gql/api';
import {
  Dish,
  RKeeperBusinessEntityInfo,
  RkeeperFixtures,
} from '@bgap/rkeeper-api';
import { RequiredId } from '@bgap/shared/types';
import {
  unitFixture,
  productFixture,
  chainFixture,
  groupFixture,
} from '@bgap/shared/fixtures';

const testIdPrefix = `rkeeper-cf0d1110-a2ce-45cf-aa69-6782bbc44cad`;

export const rawData = {
  data: {
    dishes: [
      RkeeperFixtures.dish,
      RkeeperFixtures.dish2,
      RkeeperFixtures.duplicatedDish,
      RkeeperFixtures.badDish,
      RkeeperFixtures.inactiveDish,
      RkeeperFixtures.dishWithModifier,
      RkeeperFixtures.dishWithSameModifier,
    ],
    modifiers: [RkeeperFixtures.modifier, RkeeperFixtures.unusedModifier],
  },
};

export const rkeeperProductGuid = 'RKEEPERGUID';

const unitId = `${testIdPrefix}-unit`;
const chainId = `${testIdPrefix}-chain`;
const groupId = `${testIdPrefix}-group`;

export const rkeeperUnit: RequiredId<CrudApi.CreateUnitInput> = {
  ...unitFixture.createRkeeperUnit,
  id: unitId,
  groupId,
  chainId,
  externalId: 'EXTERNAL-RESTAURANT-ID',
};

export const rkeeperUnitProduct: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}-unitproduct`,
  externalId: rkeeperProductGuid,
};

export const rkeeperUnitProduct2: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}-unitproduct2`,
  externalId: rkeeperProductGuid + '2',
};

export const processedDish: Dish = {
  price: 50000,
  active: true,
  id: 1000114,
  guid: '4b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  name: 'Próba ital',
};

export const businessEntity: RKeeperBusinessEntityInfo = {
  chainId,
  groupId,
  unitId,
};

export const createChain: RequiredId<CrudApi.CreateChainInput> = {
  ...chainFixture.chainBase,
  id: chainId,
};

export const createGroup: RequiredId<CrudApi.CreateGroupInput> = {
  ...groupFixture.groupBase,
  id: groupId,
  chainId,
};

export const realTestExternalId = '109150001';
