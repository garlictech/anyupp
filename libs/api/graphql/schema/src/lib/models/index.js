// @ts-check
import { initSchema } from '@aws-amplify/datastore';
import { schema } from './schema';

const CardBrand = {
  "AMEX": "amex",
  "DINERS": "diners",
  "DISCOVER": "discover",
  "JCB": "jcb",
  "MASTERCARD": "mastercard",
  "UNIONPAY": "unionpay",
  "VISA": "visa",
  "UNKNOWN": "unknown"
};

const CardFundingType = {
  "CREDIT": "credit",
  "DEBIT": "debit",
  "PREPAID": "prepaid",
  "UNKNOWN": "unknown"
};

const { AdminUser, StripeCard, Chain, Group, Order, ProductCategory, ChainProduct, Unit, User, AdminUserRole, AdminRoleEntity, AdminUserSettings, Address, Location, LocalizedItem, CardChecks, StripeMetadata, StartStripePaymentOutput, ChainStyle, ChainStyleColors, ChainStyleImages, StatusLog, PriceShown, OrderItem, Place, ProductVariant, ProductVariantPack, Availability, PaymentMode, FloorMapData, FloorMapDataObject, Lane, DailySchedule, WeeklySchedule, CustomDailySchedule } = initSchema(schema);

export {
  AdminUser,
  StripeCard,
  Chain,
  Group,
  Order,
  ProductCategory,
  ChainProduct,
  Unit,
  User,
  CardBrand,
  CardFundingType,
  AdminUserRole,
  AdminRoleEntity,
  AdminUserSettings,
  Address,
  Location,
  LocalizedItem,
  CardChecks,
  StripeMetadata,
  StartStripePaymentOutput,
  ChainStyle,
  ChainStyleColors,
  ChainStyleImages,
  StatusLog,
  PriceShown,
  OrderItem,
  Place,
  ProductVariant,
  ProductVariantPack,
  Availability,
  PaymentMode,
  FloorMapData,
  FloorMapDataObject,
  Lane,
  DailySchedule,
  WeeklySchedule,
  CustomDailySchedule
};