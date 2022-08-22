import { RequiredId } from '@bgap/shared/types';
import {
  CreateUnitInput,
  OrderMode,
  OrderPaymentPolicy,
  PaymentMethod,
  PaymentType,
  PosType,
  ServingMode,
  UnitMapObjectType,
  WeeklySchedule,
} from '@bgap/domain';
import { testIdPrefix } from './common';
import {
  rkeeperEndpoint,
  yellowRkeeperPassword,
  yellowRkeeperUsername,
} from './rkeeper';
import * as R from 'ramda';

const unitId_NotExisting = `${testIdPrefix}NOT_EXISTING_UNIT`;

const openingHours: WeeklySchedule = {
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

export const unitBase = {
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
  },
  location: {
    lat: 47,
    lon: 19,
  },
  description: {
    hu: `Teszt unit`,
    en: `Test unit`,
  },
  orderPaymentPolicy: OrderPaymentPolicy.prepay,
  paymentModes: [
    {
      method: PaymentMethod.cash,
      type: PaymentType.cash,
    },
    {
      method: PaymentMethod.card,
      type: PaymentType.card,
    },
    {
      method: PaymentMethod.inapp,
      type: PaymentType.stripe,
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
  supportedOrderModes: [OrderMode.pickup, OrderMode.instant],
  supportedServingModes: [ServingMode.inplace, ServingMode.takeaway],
  currency: 'EUR',
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

export const createRkeeperUnit: RequiredId<CreateUnitInput> = {
  ...unitBase,
  id: 'rkeeper-unit',
  externalId: 'restaurantid',
  pos: {
    type: PosType.rkeeper,
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

const unitInstantTakeaway: RequiredId<CreateUnitInput> = {
  ...unitBase,
  id: 'unit-it',
  name: `Instant Takeaway Kocsma`,
  supportedOrderModes: [OrderMode.instant],
  supportedServingModes: [ServingMode.takeaway],
};

const unitPickupTakeaway: RequiredId<CreateUnitInput> = {
  ...unitBase,
  id: 'unit-pt',
  name: `Pickup Takeaway Kifőzde`,
  supportedOrderModes: [OrderMode.pickup],
  supportedServingModes: [ServingMode.takeaway],
};

const unitInstantInplace: RequiredId<CreateUnitInput> = {
  ...unitBase,
  id: 'unit-ii',
  name: `Instant Inplace Csárda`,
  supportedOrderModes: [OrderMode.instant],
  supportedServingModes: [ServingMode.inplace],
};

const unitPickupInplace: RequiredId<CreateUnitInput> = {
  ...unitBase,
  id: 'unit-pi',
  name: `Pickup Inplace Resztoran`,
  supportedOrderModes: [OrderMode.pickup],
  supportedServingModes: [ServingMode.inplace],
};

const kesdobalo: RequiredId<CreateUnitInput> = {
  ...R.omit(['createdAt', 'updatedAt'], unitBase),
  id: 'a-kesdobalo',
  name: `Késdobáló`,
  timeZone: 'Europe/Budapest',
  supportedServingModes: [ServingMode.inplace],
  supportedOrderModes: [OrderMode.instant],
  coverBanners: [
    {
      imageUrl:
        'http://1.bp.blogspot.com/--hTHo2uuDHM/UicXpXI-cNI/AAAAAAAAAzQ/zOrpgDVawJo/s1600/rejt%C5%91.jpg',
    },
    {
      imageUrl:
        'https://scontent.fbud5-1.fna.fbcdn.net/v/t31.18172-8/178281_453909654650620_1346047036_o.jpg?_nc_cat=102&ccb=1-7&_nc_sid=09cbfe&_nc_ohc=q_z1ac04pLUAX8CeQoA&_nc_ht=scontent.fbud5-1.fna&oh=00_AT-_OH7-46PdxRBSytAmnBWjdX4qO209yY51RjXo1yyEuA&oe=63209762',
    },
  ],
  floorMap: {
    w: 800,
    h: 300,
    objects: [
      {
        id: 'hk6xk4xwh9n',
        t: UnitMapObjectType.table_r,
        c: '',
        w: 150,
        h: 60,
        r: null,
        a: 0,
        x: 10,
        y: 10,
        tID: null,
        sID: null,
      },
    ],
  },
};

export const unitFixture = {
  openingHours,
  unitBase,
  createRkeeperUnit,
  unitId_NotExisting,
  unitInstantInplace,
  unitInstantTakeaway,
  unitPickupInplace,
  unitPickupTakeaway,
  kesdobalo,
};
