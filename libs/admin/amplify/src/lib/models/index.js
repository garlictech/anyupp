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

const { AdminUser, Chain, Group, Unit, User, StripeCard, Order, ProductCategory, ChainProduct, AdminUserRole, AdminRoleEntity, AdminUserSettings, LocalizedItem, ChainStyle, ChainStyleColors, ChainStyleImages, Address, Location, PaymentMode, FloorMapData, FloorMapDataObject, Lane, DailySchedule, WeeklySchedule, CustomDailySchedule, CardChecks, StripeMetadata, StartStripePaymentOutput, StatusLog, PriceShown, OrderItem, Place, ProductVariant, ProductVariantPack, Availability } = initSchema(schema);

export {
  AdminUser,
  Chain,
  Group,
  Unit,
  User,
  StripeCard,
  Order,
  ProductCategory,
  ChainProduct,
  CardBrand,
  CardFundingType,
  AdminUserRole,
  AdminRoleEntity,
  AdminUserSettings,
  LocalizedItem,
  ChainStyle,
  ChainStyleColors,
  ChainStyleImages,
  Address,
  Location,
  PaymentMode,
  FloorMapData,
  FloorMapDataObject,
  Lane,
  DailySchedule,
  WeeklySchedule,
  CustomDailySchedule,
  CardChecks,
  StripeMetadata,
  StartStripePaymentOutput,
  StatusLog,
  PriceShown,
  OrderItem,
  Place,
  ProductVariant,
  ProductVariantPack,
  Availability
};