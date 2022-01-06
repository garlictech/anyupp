import * as CrudApi from '@bgap/crud-gql/api';
import { PaymentMode } from '@bgap/crud-gql/api';
import { Allergen } from '@bgap/shared/types';

export const DEFAULT_LANG = 'en-US';

export const WEEKLY_VARIANT_AVAILABILITY = {
  MONDAY: 'common.days.mon',
  TUESDAY: 'common.days.tue',
  WEDNESDAY: 'common.days.wed',
  THURSDAY: 'common.days.thu',
  FRIDAY: 'common.days.fri',
  SATURDAY: 'common.days.sat',
  SUNDAY: 'common.days.sun',
};

export const TIME_FORMAT_PATTERN = '^([0-1][0-9]|2[0-3]):[0-5][0-9]$';

export const MENU_ROLES = {
  DASHBOARD: [
    CrudApi.Role.superuser,
    CrudApi.Role.chainadmin,
    CrudApi.Role.groupadmin,
    CrudApi.Role.unitadmin,
    CrudApi.Role.staff,
  ],
  PRODUCTS: [
    CrudApi.Role.superuser,
    CrudApi.Role.chainadmin,
    CrudApi.Role.groupadmin,
    CrudApi.Role.unitadmin,
  ],
  PRODUCT_CATEGORIES: [CrudApi.Role.superuser, CrudApi.Role.chainadmin],
  MODIFIERS_AND_EXTRAS: [CrudApi.Role.superuser, CrudApi.Role.chainadmin],
  UNITS: [
    CrudApi.Role.superuser,
    CrudApi.Role.chainadmin,
    CrudApi.Role.groupadmin,
    CrudApi.Role.unitadmin,
  ],
  GROUPS: [
    CrudApi.Role.superuser,
    CrudApi.Role.chainadmin,
    CrudApi.Role.groupadmin,
  ],
  CHAINS: [CrudApi.Role.superuser, CrudApi.Role.chainadmin],
  USERS: [CrudApi.Role.superuser],
  ADMINS: [
    CrudApi.Role.superuser,
    CrudApi.Role.chainadmin,
    CrudApi.Role.groupadmin,
    CrudApi.Role.unitadmin,
  ],
  ROLE_CONTEXTS: [
    CrudApi.Role.superuser,
    CrudApi.Role.chainadmin,
    CrudApi.Role.groupadmin,
    CrudApi.Role.unitadmin,
  ],
};

export const PAYMENT_MODES: PaymentMode[] = [
  {
    type: CrudApi.PaymentType.cash,
    caption: 'common.paymentModes.cash',
    method: CrudApi.PaymentMethod.cash,
  },
  {
    type: CrudApi.PaymentType.card,
    caption: 'common.paymentModes.card',
    method: CrudApi.PaymentMethod.card,
  },
  {
    type: CrudApi.PaymentType.googlepay,
    caption: 'common.paymentModes.googlepay',
    method: CrudApi.PaymentMethod.inapp,
  },
  {
    type: CrudApi.PaymentType.applepay,
    caption: 'common.paymentModes.applepay',
    method: CrudApi.PaymentMethod.inapp,
  },
  {
    type: CrudApi.PaymentType.stripe,
    caption: 'common.paymentModes.stripe',
    method: CrudApi.PaymentMethod.inapp,
  },
  {
    type: CrudApi.PaymentType.simple,
    caption: 'common.paymentModes.simple',
    method: CrudApi.PaymentMethod.inapp,
  },
];

export const SERVING_MODES = [
  CrudApi.ServingMode.inplace,
  CrudApi.ServingMode.takeaway,
];

export const ORDER_MODES = [
  CrudApi.OrderMode.instant,
  CrudApi.OrderMode.pickup,
];

export const DEFAULT_LANE_COLOR = '#5B7AFF';

export const ALLERGENS: Allergen[] = [
  {
    id: 'gluten',
    idx: 1,
  },
  {
    id: 'crustaceans',
    idx: 2,
  },
  {
    id: 'egg',
    idx: 3,
  },
  {
    id: 'fish',
    idx: 4,
  },
  {
    id: 'peanut',
    idx: 5,
  },
  {
    id: 'soya',
    idx: 6,
  },
  {
    id: 'milk',
    idx: 7,
  },
  {
    id: 'treenuts',
    idx: 8,
  },
  {
    id: 'sulphites',
    idx: 9,
  },
  {
    id: 'mustard',
    idx: 10,
  },
  {
    id: 'celery',
    idx: 11,
  },
  {
    id: 'sesame',
    idx: 12,
  },
  {
    id: 'lupin',
    idx: 13,
  },
  {
    id: 'molluscs',
    idx: 14,
  },
];
