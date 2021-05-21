import { CrudApi } from '@bgap/crud-gql/api';
import { EAdminRole, ETransactionType, IAllergen, IPaymentMode } from '@bgap/shared/types';

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
    EAdminRole.SUPERUSER,
    EAdminRole.CHAIN_ADMIN,
    EAdminRole.GROUP_ADMIN,
    EAdminRole.UNIT_ADMIN,
    EAdminRole.STAFF,
  ],
  PRODUCTS: [
    EAdminRole.SUPERUSER,
    EAdminRole.CHAIN_ADMIN,
    EAdminRole.GROUP_ADMIN,
    EAdminRole.UNIT_ADMIN,
  ],
  PRODUCT_CATEGORIES: [EAdminRole.SUPERUSER, EAdminRole.CHAIN_ADMIN],
  MODIFIERS_AND_EXTRAS: [EAdminRole.SUPERUSER, EAdminRole.CHAIN_ADMIN],
  UNITS: [
    EAdminRole.SUPERUSER,
    EAdminRole.CHAIN_ADMIN,
    EAdminRole.GROUP_ADMIN,
    EAdminRole.UNIT_ADMIN,
  ],
  GROUPS: [
    EAdminRole.SUPERUSER,
    EAdminRole.CHAIN_ADMIN,
    EAdminRole.GROUP_ADMIN,
  ],
  CHAINS: [EAdminRole.SUPERUSER, EAdminRole.CHAIN_ADMIN],
  USERS: [EAdminRole.SUPERUSER],
  ADMINS: [
    EAdminRole.SUPERUSER,
    EAdminRole.CHAIN_ADMIN,
    EAdminRole.GROUP_ADMIN,
    EAdminRole.UNIT_ADMIN,
  ],
  ROLE_CONTEXTS: [
    EAdminRole.SUPERUSER,
    EAdminRole.CHAIN_ADMIN,
    EAdminRole.GROUP_ADMIN,
    EAdminRole.UNIT_ADMIN,
  ],
};

export const PAYMENT_MODES: IPaymentMode[] = [
  {
    name: ETransactionType.CASH,
    caption: 'common.paymentModes.CASH',
    method: CrudApi.PaymentMethod.CASH,
  },
  {
    name: ETransactionType.CARD,
    caption: 'common.paymentModes.CARD',
    method: CrudApi.PaymentMethod.CARD,
  },
  {
    name: ETransactionType.GOOGLE_PAY,
    caption: 'Google Pay',
    method: CrudApi.PaymentMethod.INAPP,
  },
  {
    name: ETransactionType.APPLE_PAY,
    caption: 'Apple Pay',
    method: CrudApi.PaymentMethod.INAPP,
  },
  {
    name: ETransactionType.STRIPE,
    caption: 'Stripe',
    method: CrudApi.PaymentMethod.INAPP,
  },
  {
    name: ETransactionType.SIMPLE,
    caption: 'Simple Pay',
    method: CrudApi.PaymentMethod.INAPP,
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
