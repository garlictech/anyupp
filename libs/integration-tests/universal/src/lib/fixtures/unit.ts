import { CrudApi } from '@bgap/crud-gql/api';
import { groupSeed } from './group';
import { chainSeed } from './chain';

const unitId_01 = 'unit_1_id';
const unitId_seeded_01 = 'unit_c1_g1_1_id';
const unitId_seeded_02 = 'unit_c1_g1_2_id';
const unitId_seeded_03 = 'unit_c1_g2_1_id';
const unitId_NotExisting = 'NOT_EXISTING_UNIT';

const unit_01: CrudApi.CreateUnitInput = {
  id: unitId_01,
  groupId: groupSeed.groupId_seeded_01,
  chainId: chainSeed.chainId_seeded_01,
  isActive: true,
  isAcceptingOrders: true,
  name: `Test unit #${unitId_01}`,
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
    hu: `Teszt unit #${unitId_01} leírás`,
    en: `Test unit #${unitId_01} description`,
  },
  paymentModes: [
    {
      method: CrudApi.PaymentMethod.CASH,
      name: 'Cash',
    },
    {
      method: CrudApi.PaymentMethod.CARD,
      name: 'Card',
    },
    {
      method: CrudApi.PaymentMethod.INAPP,
      name: 'Stripe',
    },
  ],
  lanes: [
    {
      color: '#e72222',
      id: 'lane_01',
      name: 'bár',
    },
    {
      color: '#e123ef',
      id: 'lane_02',
      name: 'konyha',
    },
  ],
  open: {
    from: '08:00',
    to: '18:00',
  },
};

export const unitSeed = {
  unit_01,
  unitId_NotExisting,
  unitId_seeded_01,
  unitId_seeded_02,
  unitId_seeded_03,
};
