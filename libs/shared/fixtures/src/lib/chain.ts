import * as CrudApi from '@bgap/crud-gql/api';
import { seededIdPrefix, testIdPrefix } from './common';
import { RequiredId } from '@bgap/shared/types';

const chainId_01 = `${testIdPrefix}chain_1_id`;
const chainId_seeded_01 = `${seededIdPrefix}chain_1_id`;

const chainBase: CrudApi.CreateChainInput = {
  id: `${testIdPrefix}chain_id_`,
  name: `Test chain #${chainId_01}`,
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
    hu: `Teszt chain #${chainId_01} leírás`,
    en: `Test chain #${chainId_01} description`,
  },
  isActive: true,
  email: 'test@anyupp.com',
  phone: '1234567890',
  style: {
    colors: {
      backgroundLight: '#FFFFFF',
      backgroundDark: '#D6DDE0',
      textDark: '#303030',
      textLight: '#FFFFFF',
      indicator: '#30BF60',
      highlight: '#A8692A',
      disabled: '#303030',
      borderDark: '#E7E5D0',
      borderLight: '#C3CACD',
    },
  },
};

const chain_01: RequiredId<CrudApi.CreateChainInput> = {
  ...chainBase,
  id: chainId_01,
};

export const chainFixture = {
  chainBase,
  chain_01,
  chainId_seeded_01,
};
