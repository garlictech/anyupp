import * as CrudApi from '@bgap/crud-gql/api';
import { chainSeed } from './chain';
import { seededIdPrefix, testIdPrefix } from './common';
import { RequiredId } from '@bgap/shared/types';

const groupId_01 = `${testIdPrefix}group_1_id`;
const groupId_seeded_01 = `${seededIdPrefix}group_c1_1_id`;
const groupId_seeded_02 = `${seededIdPrefix}group_c1_2_id`;
const groupId_seeded_03 = `${seededIdPrefix}group_c2_1_id`;

const groupBase: Omit<CrudApi.CreateGroupInput, 'chainId'> = {
  name: `Test group #${groupId_01}`,
  address: {
    address: 'Ág u. 1.',
    city: 'Budapest',
    country: 'Magyarország',
    title: 'HQ',
    postalCode: '1021',
    location: {
      lat: 47,
      lng: 19,
    },
  },
  description: {
    hu: `Teszt group #${groupId_01} leírás`,
    en: `Test group #${groupId_01} description`,
  },
  currency: 'EUR',
  email: 'test@anyupp.com',
  phone: '36701234123',
};

const group_01: RequiredId<CrudApi.CreateGroupInput> = {
  ...groupBase,
  id: groupId_01,
  chainId: chainSeed.chainId_seeded_01,
};

export const groupSeed = {
  groupBase,
  group_01,
  groupId_seeded_01,
  groupId_seeded_02,
  groupId_seeded_03,
};
