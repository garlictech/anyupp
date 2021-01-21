import { EAdminRole, EPaymentMethod } from '@bgap/shared/types/enums';
import { IPaymentMode } from '@bgap/shared/types/interfaces';

// TODO env enként külön
export const GOOGLE_API_KEY = 'AIzaSyCgCNK6CoqyGsud_6J0GCqzJ3K6RCh3WuI';

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
};

export const PAYMENT_MODES: IPaymentMode[] = [
  {
    name: 'Cash',
    caption: 'common.paymentModes.cash',
    method: EPaymentMethod.CASH,
  },
  {
    name: 'Card',
    caption: 'common.paymentModes.card',
    method: EPaymentMethod.CARD,
  },
  {
    name: 'Google Pay',
    caption: 'Google Pay',
    method: EPaymentMethod.INAPP,
  },
  {
    name: 'Apple Pay',
    caption: 'Apple Pay',
    method: EPaymentMethod.INAPP,
  },
  {
    name: 'Stripe',
    caption: 'Stripe',
    method: EPaymentMethod.INAPP,
  },
  {
    name: 'Simple Pay',
    caption: 'Simple Pay',
    method: EPaymentMethod.INAPP,
  },
];

export const DEFAULT_LANE_COLOR = '#5B7AFF';
