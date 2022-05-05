import * as CrudApi from '@bgap/crud-gql/api';
import { RequiredId } from '@bgap/shared/types';
import { chainFixture } from './chain';
import { seededIdPrefix, testIdPrefix } from './common';

const groupId_01 = `${testIdPrefix}group_1_id`;
const groupId_seeded_01 = `${seededIdPrefix}group_c1_1_id`;
const groupId_seeded_02 = `${seededIdPrefix}group_c1_2_id`;
const groupId_seeded_03 = `${seededIdPrefix}group_c2_1_id`;

const groupBase: Omit<CrudApi.CreateGroupInput, 'chainId'> = {
  name: `Monád csoport S`,
  address: {
    address: 'Ág u. 1.',
    city: 'Budapest',
    country: 'Magyarország',
    title: 'HQ',
    postalCode: '1021',
    location: {
      lat: 0,
      lon: 0,
    },
  },
  description: {
    hu: `Teszt group #${groupId_01} leírás`,
    en: `Test group #${groupId_01} description`,
  },
  currency: 'EUR',
  email: 'testuser+groupadmin@anyupp.com',
  phone: '36701234123',
};

const group_01: RequiredId<CrudApi.CreateGroupInput> = {
  ...groupBase,
  id: groupId_01,
  chainId: chainFixture.chain_01.id,
};

export const groupFixture = {
  groupBase,
  group_01,
  groupId_seeded_01,
  groupId_seeded_02,
  groupId_seeded_03,
};
