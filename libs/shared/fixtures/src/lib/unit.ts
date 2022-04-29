import * as CrudApi from '@bgap/crud-gql/api';
import { RequiredId } from '@bgap/shared/types';
import { chainFixture } from './chain';
import { seededIdPrefix, testIdPrefix } from './common';
import { groupFixture } from './group';
import {
  rkeeperEndpoint,
  yellowRkeeperPassword,
  yellowRkeeperUsername,
} from './rkeeper';

const unitId_01 = `${testIdPrefix}unit_1_id`;
const unitId_seeded_01 = `${seededIdPrefix}unit_c1_g1_1_id`;
const unitId_seeded_02 = `${seededIdPrefix}unit_c1_g1_2_id`;
const unitId_seeded_03 = `${seededIdPrefix}unit_c1_g2_1_id`;
const unitId_NotExisting = `${testIdPrefix}NOT_EXISTING_UNIT`;

const openingHours: CrudApi.WeeklySchedule = {
  mon: {
    from: '09:00',
    to: '17:00',
  },
  tue: {
    from: '09:00',
    to: '18:00',
  },
  wed: {
    from: '09:00',
    to: '19:00',
  },
  thu: {
    from: '09:00',
    to: '20:00',
  },
  fri: {
    from: '09:00',
    to: '21:00',
  },
  sat: {
    from: '',
    to: '',
  },
  sun: {
    from: '',
    to: '',
  },
  custom: [
    {
      date: '2021-07-01',
      from: '09:00',
      to: '09:30',
    },
    {
      date: '2021-07-08',
      from: '10:00',
      to: '19:30',
    },
    {
      date: '2021-07-10',
      from: '11:00',
      to: '14:00',
    },
  ],
};

const unitBase = {
  isActive: true,
  isAcceptingOrders: true,
  name: `Késdobáló S`,
  packagingTaxPercentage: 27,
  address: {
    address: 'Ág u. 1.',
    city: 'Budapest',
    country: 'Magyarország',
    title: 'HQ',
    postalCode: '1021',
    location: {
      lat: 47,
      lon: 19,
    },
  },
  location: {
    lat: 47,
    lon: 19,
  },
  description: {
    hu: `Teszt unit #${unitId_01} leírás`,
    en: `Test unit #${unitId_01} description`,
  },
  orderPaymentPolicy: CrudApi.OrderPaymentPolicy.prepay,
  paymentModes: [
    {
      method: CrudApi.PaymentMethod.cash,
      type: CrudApi.PaymentType.cash,
    },
    {
      method: CrudApi.PaymentMethod.card,
      type: CrudApi.PaymentType.card,
    },
    {
      method: CrudApi.PaymentMethod.inapp,
      type: CrudApi.PaymentType.stripe,
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
    from: '1970-01-01',
    to: '2970-01-01',
  },
  supportedOrderModes: [CrudApi.OrderMode.pickup, CrudApi.OrderMode.instant],
  supportedServingModes: [
    CrudApi.ServingMode.inplace,
    CrudApi.ServingMode.takeaway,
  ],
};

const unit_01: CrudApi.Unit = {
  ...unitBase,
  id: unitId_01,
  groupId: groupFixture.group_01.id,
  chainId: chainFixture.chain_01.id,
  createdAt: '2021-08-02T01:54:11.843Z',
  updatedAt: '2021-08-02T01:54:11.843Z',
};

const unitInputBase: CrudApi.CreateUnitInput = {
  ...unitBase,
  id: unitId_01,
  groupId: groupFixture.group_01.id,
  chainId: chainFixture.chain_01.id,
};

const createUnit_01: RequiredId<CrudApi.CreateUnitInput> = {
  ...unitBase,
  id: unitId_01,
  groupId: groupFixture.group_01.id,
  chainId: chainFixture.chain_01.id,
  serviceFeePolicy: {
    type: CrudApi.ServiceFeeType.applicable,
    percentage: 10,
  },
  ratingPolicies: [
    {
      key: 'question1',
      title: {
        en: 'Question',
      },
      description: {
        en: 'Desc',
      },
      ratings: [{ value: 1, text: { en: 'good' } }],
    },
  ],
  tipPolicy: {
    percents: [2],
  },
};

const createRkeeperUnit: RequiredId<CrudApi.CreateUnitInput> = {
  ...createUnit_01,
  id: 'rkeeper-unit',
  externalId: 'restaurantid',
  pos: {
    type: CrudApi.PosType.rkeeper,
    rkeeper: {
      // let's use the yellow real rkeeper endpoint
      endpointUri: rkeeperEndpoint,
      rkeeperUsername: yellowRkeeperUsername,
      rkeeperPassword: yellowRkeeperPassword,
      anyuppUsername: 'ANYUPP_USERNAME',
      anyuppPassword: 'ANYUPP_PASSWORD',
    },
  },
};

const unitInstantTakeaway: RequiredId<CrudApi.CreateUnitInput> = {
  ...unitInputBase,
  id: 'unit-it',
  name: `Instant Takeaway Kocsma`,
  supportedOrderModes: [CrudApi.OrderMode.instant],
  supportedServingModes: [CrudApi.ServingMode.takeaway],
};

const unitPickupTakeaway: RequiredId<CrudApi.CreateUnitInput> = {
  ...unitInputBase,
  id: 'unit-pt',
  name: `Pickup Takeaway Kifőzde`,
  supportedOrderModes: [CrudApi.OrderMode.pickup],
  supportedServingModes: [CrudApi.ServingMode.takeaway],
};

const unitInstantInplace: RequiredId<CrudApi.CreateUnitInput> = {
  ...unitInputBase,
  id: 'unit-ii',
  name: `Instant Inplace Csárda`,
  supportedOrderModes: [CrudApi.OrderMode.instant],
  supportedServingModes: [CrudApi.ServingMode.inplace],
};

const unitPickupInplace: RequiredId<CrudApi.CreateUnitInput> = {
  ...unitInputBase,
  id: 'unit-pi',
  name: `Pickup Inplace Resztoran`,
  supportedOrderModes: [CrudApi.OrderMode.pickup],
  supportedServingModes: [CrudApi.ServingMode.inplace],
};

export const unitFixture = {
  openingHours,
  unitBase,
  unitInputBase,
  unit_01,
  createUnit_01,
  createRkeeperUnit,
  unitId_NotExisting,
  unitId_seeded_01,
  unitId_seeded_02,
  unitId_seeded_03,
  unitInstantInplace,
  unitInstantTakeaway,
  unitPickupInplace,
  unitPickupTakeaway,
};
