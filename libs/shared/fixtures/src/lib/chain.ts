import * as CrudApi from '@bgap/crud-gql/api';
import { seededIdPrefix, testIdPrefix } from './common';
import { RequiredId } from '@bgap/shared/types';

const chainId_01 = `${testIdPrefix}chain_1_id`;
const chainId_seeded_01 = `${seededIdPrefix}chain_1_id`;

const chainBase: CrudApi.CreateChainInput = {
  id: `${testIdPrefix}chain_id_`,
  name: `˜Rab lánc S`,
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
    hu: `Rab lánc leírás`,
    en: `Prisoner chain description`,
  },
  isActive: true,
  email: 'testuser+chainadmin@anyupp.com',
  phone: '1234567890',
  style: {
    colors: {
      backgroundDark: '#d6dde0',
      backgroundLight: '#ffffff',
      borderDark: '#c3cacd',
      borderLight: '#e7e5d0',
      disabled: '#303030',
      indicator: '#30bf60',
      textDark: '#303030',
      textLight: '#ffffff',
      primary: '#30bf60', // indicator
      secondary: '#303030', // textDark
      button: '#30bf60',
      buttonText: '#fffffb',
      icon: '#30bf60',
      highlight: '#30bf60',
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
