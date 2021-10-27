import * as CrudApi from '@bgap/crud-gql/api';
import { Dish, RKeeperBusinessEntityInfo } from '@bgap/rkeeper-api';
import { RequiredId } from '@bgap/shared/types';
import {
  unitFixture,
  productFixture,
  chainFixture,
  groupFixture,
} from '@bgap/shared/fixtures';

const testIdPrefix = `rkeeper-cf0d1110-a2ce-45cf-aa69-6782bbc44cad`;

export const dish = {
  type: 'dish',
  modiweight: 0,
  price: 50000,
  modischeme: 0,
  active: 1,
  id: 1000114,
  guid: '4b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
  name: 'Pr\u00F3ba ital',
};

export const dish2 = {
  type: 'dish',
  modiweight: 0,
  price: 60000,
  modischeme: 0,
  active: 1,
  id: 1000115,
  guid: '5b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
  name: 'Pr\u00F3ba kaja',
};

export const inactiveDish = {
  type: 'dish',
  modiweight: 0,
  price: 60000,
  modischeme: 0,
  active: 0,
  id: 1000145,
  guid: '6b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
  name: 'Pr\u00F3ba kaja inactive',
};

export const duplicatedDish = {
  type: 'dish',
  modiweight: 0,
  price: 70000,
  modischeme: 0,
  active: 0,
  id: 1000115,
  guid: '5b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
  name: 'Pr\u00F3ba kaja duplicated',
};

export const badDish = {
  type: 'dish',
  modiweight: 0,
  price: 70000,
  modischeme: 0,
  active: 0,
  id: 1000116,
  guid: '6b9e3ab3-86a0-48d9-a9a9-f4e0c9fbce68',
  code: 3,
};

export const rawData = {
  data: {
    dishes: [dish, dish2, duplicatedDish, badDish, inactiveDish],
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
  externalRestaurantId: 'EXTERNAL-RESTAURANT-ID',
};

export const rkeeperUnitProduct: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}-unitproduct`,
  clientSideId: rkeeperProductGuid,
};

export const rkeeperUnitProduct2: RequiredId<CrudApi.CreateUnitProductInput> = {
  ...productFixture.unitProductInputBase,
  id: `${testIdPrefix}-unitproduct2`,
  clientSideId: rkeeperProductGuid + '2',
};

export const processedDish: Dish = {
  price: 50000,
  active: true,
  id: '1000114',
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
