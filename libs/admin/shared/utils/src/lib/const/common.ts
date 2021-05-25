import * as CrudApi from '@bgap/crud-gql/api';
import { PaymentMode } from '@bgap/crud-gql/api';
import { IAllergen } from '@bgap/shared/types';

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
    name: 'Cash',
    caption: 'common.paymentModes.cash',
    method: CrudApi.PaymentMethod.cash,
  },
  {
    name: 'Card',
    caption: 'common.paymentModes.card',
    method: CrudApi.PaymentMethod.card,
  },
  {
    name: 'GooglePay',
    caption: 'Google Pay',
    method: CrudApi.PaymentMethod.inapp,
  },
  {
    name: 'ApplePay',
    caption: 'Apple Pay',
    method: CrudApi.PaymentMethod.inapp,
  },
  {
    name: 'Stripe',
    caption: 'Stripe',
    method: CrudApi.PaymentMethod.inapp,
  },
  {
    name: 'Simple',
    caption: 'Simple Pay',
    method: CrudApi.PaymentMethod.inapp,
  },
];

export const DEFAULT_LANE_COLOR = '#5B7AFF';

export const ALLERGENS: IAllergen[] = [
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
    id: 'milk',
    idx: 6,
  },
  {
    id: 'soya',
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
