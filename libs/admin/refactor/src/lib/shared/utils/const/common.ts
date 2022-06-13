import { PaymentMode } from '@bgap/crud-gql/api';
import {
  OrderMode,
  PaymentMethod,
  PaymentType,
  Role,
  ServingMode,
} from '@bgap/domain';
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
    Role.superuser,
    Role.chainadmin,
    Role.groupadmin,
    Role.unitadmin,
    Role.staff,
  ],
  PRODUCTS: [Role.superuser, Role.chainadmin, Role.groupadmin, Role.unitadmin],
  PRODUCT_CATEGORIES: [Role.superuser, Role.chainadmin],
  MODIFIERS_AND_EXTRAS: [Role.superuser, Role.chainadmin],
  UNITS: [Role.superuser, Role.chainadmin, Role.groupadmin, Role.unitadmin],
  GROUPS: [Role.superuser, Role.chainadmin, Role.groupadmin],
  CHAINS: [Role.superuser, Role.chainadmin],
  USERS: [Role.superuser],
  ADMINS: [Role.superuser, Role.chainadmin, Role.groupadmin, Role.unitadmin],
  ROLE_CONTEXTS: [
    Role.superuser,
    Role.chainadmin,
    Role.groupadmin,
    Role.unitadmin,
  ],
};

export const PAYMENT_MODES: PaymentMode[] = [
  {
    type: PaymentType.cash,
    caption: 'common.paymentModes.cash',
    method: PaymentMethod.cash,
  },
  {
    type: PaymentType.card,
    caption: 'common.paymentModes.card',
    method: PaymentMethod.card,
  },
  {
    type: PaymentType.googlepay,
    caption: 'common.paymentModes.googlepay',
    method: PaymentMethod.inapp,
  },
  {
    type: PaymentType.applepay,
    caption: 'common.paymentModes.applepay',
    method: PaymentMethod.inapp,
  },
  {
    type: PaymentType.stripe,
    caption: 'common.paymentModes.stripe',
    method: PaymentMethod.inapp,
  },
  {
    type: PaymentType.simple,
    caption: 'common.paymentModes.simple',
    method: PaymentMethod.inapp,
  },
];

export const SERVING_MODES = [ServingMode.inplace, ServingMode.takeaway];

export const ORDER_MODES = [OrderMode.instant, OrderMode.pickup];

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
