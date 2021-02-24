import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = {
  [K in keyof T]: T[K];
};
export type MakeOptional<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> &
  { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
}

export interface Address {
  __typename?: 'Address';
  address?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  location?: Maybe<Location>;
}

export interface Location {
  __typename?: 'Location';
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
}

export interface AddressInput {
  address?: Maybe<Scalars['String']>;
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
  postalCode?: Maybe<Scalars['String']>;
  location?: Maybe<LocationInput>;
}

export interface LocationInput {
  lat?: Maybe<Scalars['Float']>;
  lng?: Maybe<Scalars['Float']>;
}

export interface LocalizedItem {
  __typename?: 'LocalizedItem';
  en?: Maybe<Scalars['String']>;
  de?: Maybe<Scalars['String']>;
  hu?: Maybe<Scalars['String']>;
}

export interface LocalizedItemInput {
  en?: Maybe<Scalars['String']>;
  de?: Maybe<Scalars['String']>;
  hu?: Maybe<Scalars['String']>;
}

export interface AdminUser {
  __typename?: 'AdminUser';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  roles: AdminUserRole;
  settings?: Maybe<AdminUserSettings>;
  address?: Maybe<Address>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface AdminUserRole {
  __typename?: 'AdminUserRole';
  role: Scalars['String'];
  entities?: Maybe<Array<Maybe<AdminRoleEntity>>>;
}

export interface AdminRoleEntity {
  __typename?: 'AdminRoleEntity';
  chainId?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  unitId?: Maybe<Scalars['String']>;
}

export interface AdminUserSettings {
  __typename?: 'AdminUserSettings';
  selectedChainId?: Maybe<Scalars['String']>;
  selectedGroupId?: Maybe<Scalars['String']>;
  selectedUnitId?: Maybe<Scalars['String']>;
  selectedProductCategoryId?: Maybe<Scalars['String']>;
  selectedLanguage?: Maybe<Scalars['String']>;
  selectedHistoryDate?: Maybe<Scalars['Int']>;
}

export interface CreateAdminUserInput {
  name: Scalars['String'];
  address?: Maybe<AddressInput>;
  email: Scalars['String'];
  phone?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
}

export interface UpdateAdminUserInput {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  address?: Maybe<AddressInput>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
}

export interface AdminUserRoleInput {
  role: Scalars['String'];
  entities?: Maybe<Array<Maybe<AdminRoleEntityInput>>>;
}

export interface AdminRoleEntityInput {
  chainId?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  unitId?: Maybe<Scalars['String']>;
}

export enum CardBrand {
  amex = 'amex',
  diners = 'diners',
  discover = 'discover',
  jcb = 'jcb',
  mastercard = 'mastercard',
  unionpay = 'unionpay',
  visa = 'visa',
  unknown = 'unknown',
}

export enum CardFundingType {
  credit = 'credit',
  debit = 'debit',
  prepaid = 'prepaid',
  unknown = 'unknown',
}

export interface CardChecks {
  __typename?: 'CardChecks';
  address_line1_check?: Maybe<Scalars['String']>;
  address_postal_code_check?: Maybe<Scalars['String']>;
  cvc_check?: Maybe<Scalars['String']>;
}

export interface StripeMetadata {
  __typename?: 'StripeMetadata';
  key: Scalars['String'];
  value: Scalars['String'];
}

export interface StripeCard {
  __typename?: 'StripeCard';
  brand?: Maybe<CardBrand>;
  checks?: Maybe<CardChecks>;
  country?: Maybe<Scalars['String']>;
  last4?: Maybe<Scalars['String']>;
  exp_month?: Maybe<Scalars['Int']>;
  exp_year?: Maybe<Scalars['Int']>;
  fingerprint?: Maybe<Scalars['String']>;
  funding?: Maybe<CardFundingType>;
  three_d_secure?: Maybe<Scalars['String']>;
  id: Scalars['ID'];
  object: Scalars['String'];
  metadata: Array<StripeMetadata>;
}

export interface StartStripePaymentInput {
  chainId: Scalars['ID'];
  unitId: Scalars['ID'];
  userId: Scalars['ID'];
  paymentMethodId?: Maybe<Scalars['ID']>;
}

export interface StartStripePaymentOutput {
  __typename?: 'StartStripePaymentOutput';
  clientSecret: Scalars['String'];
  status: Scalars['String'];
}

export interface Chain {
  __typename?: 'Chain';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<LocalizedItem>;
  style?: Maybe<ChainStyle>;
  isActive?: Maybe<Scalars['Boolean']>;
}

export interface ChainStyle {
  __typename?: 'ChainStyle';
  colors?: Maybe<ChainStyleColors>;
  images?: Maybe<ChainStyleImages>;
}

export interface ChainStyleColors {
  __typename?: 'ChainStyleColors';
  backgroundLight?: Maybe<Scalars['String']>;
  backgroundDark?: Maybe<Scalars['String']>;
  borderLight?: Maybe<Scalars['String']>;
  borderDark?: Maybe<Scalars['String']>;
  disabled?: Maybe<Scalars['String']>;
  highlight?: Maybe<Scalars['String']>;
  indicator?: Maybe<Scalars['String']>;
  textLight?: Maybe<Scalars['String']>;
  textDark?: Maybe<Scalars['String']>;
}

export interface ChainStyleImages {
  __typename?: 'ChainStyleImages';
  header?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
}

export interface CreateChainInput {
  name?: Maybe<Scalars['String']>;
  description?: Maybe<LocalizedItemInput>;
  style?: Maybe<ChainStyleInput>;
  isActive?: Maybe<Scalars['Boolean']>;
}

export interface UpdateChainInput {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<LocalizedItemInput>;
  style?: Maybe<ChainStyleInput>;
  isActive?: Maybe<Scalars['Boolean']>;
}

export interface ChainStyleInput {
  colors?: Maybe<ChainStyleColorsInput>;
  images?: Maybe<ChainStyleImagesInput>;
}

export interface ChainStyleColorsInput {
  backgroundLight?: Maybe<Scalars['String']>;
  backgroundDark?: Maybe<Scalars['String']>;
  borderLight?: Maybe<Scalars['String']>;
  borderDark?: Maybe<Scalars['String']>;
  disabled?: Maybe<Scalars['String']>;
  highlight?: Maybe<Scalars['String']>;
  indicator?: Maybe<Scalars['String']>;
  textLight?: Maybe<Scalars['String']>;
  textDark?: Maybe<Scalars['String']>;
}

export interface ChainStyleImagesInput {
  header?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
}

export interface Group {
  __typename?: 'Group';
  id: Scalars['ID'];
  chainId: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<LocalizedItem>;
  currency?: Maybe<Scalars['String']>;
  address?: Maybe<Address>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface CreateGroupInput {
  chainId: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<LocalizedItemInput>;
  currency?: Maybe<Scalars['String']>;
  address?: Maybe<AddressInput>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface UpdateGroupInput {
  id: Scalars['ID'];
  chainId: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  description?: Maybe<LocalizedItemInput>;
  currency?: Maybe<Scalars['String']>;
  address?: Maybe<AddressInput>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface StatusLog {
  __typename?: 'StatusLog';
  userId?: Maybe<Scalars['ID']>;
  status?: Maybe<Scalars['String']>;
  ts?: Maybe<Scalars['Int']>;
}

export interface PriceShown {
  __typename?: 'PriceShown';
  currency?: Maybe<Scalars['String']>;
  pricePerUnit?: Maybe<Scalars['Float']>;
  priceSum?: Maybe<Scalars['Float']>;
  tax?: Maybe<Scalars['Int']>;
  taxSum?: Maybe<Scalars['Float']>;
}

export interface PriceShownInput {
  currency?: Maybe<Scalars['String']>;
  pricePerUnit?: Maybe<Scalars['Float']>;
  priceSum?: Maybe<Scalars['Float']>;
  tax?: Maybe<Scalars['Int']>;
  taxSum?: Maybe<Scalars['Float']>;
}

export interface OrderItem {
  __typename?: 'OrderItem';
  id: Scalars['ID'];
  created?: Maybe<Scalars['Int']>;
  productName?: Maybe<LocalizedItem>;
  priceShown?: Maybe<PriceShown>;
  productId?: Maybe<Scalars['ID']>;
  quantity?: Maybe<Scalars['Int']>;
  statusLog?: Maybe<Array<Maybe<StatusLog>>>;
  variantId?: Maybe<Scalars['ID']>;
  variantName?: Maybe<LocalizedItem>;
  laneId?: Maybe<Scalars['ID']>;
}

export interface CreateOrderItemInput {
  productName?: Maybe<LocalizedItemInput>;
  priceShown?: Maybe<PriceShownInput>;
  productId?: Maybe<Scalars['ID']>;
  quantity?: Maybe<Scalars['Int']>;
  variantId?: Maybe<Scalars['ID']>;
  variantName?: Maybe<LocalizedItemInput>;
  laneId?: Maybe<Scalars['ID']>;
}

export interface UpdateOrderItemInput {
  id: Scalars['ID'];
  productName?: Maybe<LocalizedItemInput>;
  priceShown?: Maybe<PriceShownInput>;
  productId?: Maybe<Scalars['ID']>;
  quantity?: Maybe<Scalars['Int']>;
  variantId?: Maybe<Scalars['ID']>;
  variantName?: Maybe<LocalizedItemInput>;
  laneId?: Maybe<Scalars['ID']>;
}

export interface Order {
  __typename?: 'Order';
  id: Scalars['ID'];
  created?: Maybe<Scalars['Int']>;
  items?: Maybe<Array<Maybe<OrderItem>>>;
  paymentMethod?: Maybe<Scalars['String']>;
  staffId?: Maybe<Scalars['ID']>;
  statusLog?: Maybe<Array<Maybe<StatusLog>>>;
  sumPriceShown?: Maybe<PriceShown>;
  takeAway?: Maybe<Scalars['Boolean']>;
  userId?: Maybe<Scalars['ID']>;
  place?: Maybe<Place>;
  paymentIntention?: Maybe<Scalars['Int']>;
}

export interface Place {
  __typename?: 'Place';
  seat?: Maybe<Scalars['String']>;
  table?: Maybe<Scalars['String']>;
}

export interface PlaceInput {
  seat?: Maybe<Scalars['String']>;
  table?: Maybe<Scalars['String']>;
}

export interface CreateOrderInput {
  orderItems?: Maybe<Array<Maybe<Scalars['ID']>>>;
  paymentMethod?: Maybe<Scalars['String']>;
  staffId?: Maybe<Scalars['ID']>;
  sumPriceShown?: Maybe<PriceShownInput>;
  takeAway?: Maybe<Scalars['Boolean']>;
  userId?: Maybe<Scalars['ID']>;
  place?: Maybe<PlaceInput>;
  paymentIntention?: Maybe<Scalars['Int']>;
}

export interface UpdateOrderInput {
  id: Scalars['ID'];
  orderItems?: Maybe<Array<Maybe<Scalars['ID']>>>;
  paymentMethod?: Maybe<Scalars['String']>;
  staffId?: Maybe<Scalars['ID']>;
  sumPriceShown?: Maybe<PriceShownInput>;
  takeAway?: Maybe<Scalars['Boolean']>;
  userId?: Maybe<Scalars['ID']>;
  place?: Maybe<PlaceInput>;
  paymentIntention?: Maybe<Scalars['Int']>;
}

export interface ProductCategory {
  __typename?: 'ProductCategory';
  id: Scalars['ID'];
  description?: Maybe<LocalizedItem>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<LocalizedItem>;
  position?: Maybe<Scalars['String']>;
}

export interface CreateProductCategoryInput {
  description?: Maybe<LocalizedItemInput>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<LocalizedItemInput>;
  position?: Maybe<Scalars['String']>;
}

export interface UpdateProductCategoryInput {
  id: Scalars['ID'];
  description?: Maybe<LocalizedItemInput>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<LocalizedItemInput>;
  position?: Maybe<Scalars['String']>;
}

export interface ChainProduct {
  __typename?: 'ChainProduct';
  id: Scalars['ID'];
  description?: Maybe<LocalizedItem>;
  extends?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  isVisible?: Maybe<Scalars['Boolean']>;
  tax?: Maybe<Scalars['Int']>;
  name?: Maybe<LocalizedItem>;
  position?: Maybe<Scalars['String']>;
  productCategoryId?: Maybe<Scalars['ID']>;
  laneId?: Maybe<Scalars['ID']>;
  productType?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
}

export interface CreateChainProductInput {
  description?: Maybe<LocalizedItemInput>;
  extends?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  isVisible?: Maybe<Scalars['Boolean']>;
  tax?: Maybe<Scalars['Int']>;
  name?: Maybe<LocalizedItemInput>;
  position?: Maybe<Scalars['String']>;
  productCategoryId?: Maybe<Scalars['ID']>;
  laneId?: Maybe<Scalars['ID']>;
  productType?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<Maybe<ProductVariantInput>>>;
}

export interface UpdateChainProductInput {
  id: Scalars['ID'];
  description?: Maybe<LocalizedItemInput>;
  extends?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  isVisible?: Maybe<Scalars['Boolean']>;
  tax?: Maybe<Scalars['Int']>;
  name?: Maybe<LocalizedItemInput>;
  position?: Maybe<Scalars['String']>;
  productCategoryId?: Maybe<Scalars['ID']>;
  laneId?: Maybe<Scalars['ID']>;
  productType?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<Maybe<ProductVariantInput>>>;
}

export interface ProductVariant {
  __typename?: 'ProductVariant';
  variantName?: Maybe<LocalizedItem>;
  pack?: Maybe<ProductVariantPack>;
  refGroupPrice?: Maybe<Scalars['Float']>;
  isAvailable?: Maybe<Scalars['Boolean']>;
  price?: Maybe<Scalars['Float']>;
  availabilities?: Maybe<Array<Maybe<Availability>>>;
  availableFrom?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
}

export interface ProductVariantInput {
  variantName?: Maybe<LocalizedItemInput>;
  pack?: Maybe<ProductVariantPackInput>;
  refGroupPrice?: Maybe<Scalars['Float']>;
  isAvailable?: Maybe<Scalars['Boolean']>;
  price?: Maybe<Scalars['Float']>;
  availabilities?: Maybe<Array<Maybe<AvailabilityInput>>>;
  availableFrom?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
}

export interface ProductVariantPack {
  __typename?: 'ProductVariantPack';
  size?: Maybe<Scalars['Float']>;
  unit?: Maybe<Scalars['String']>;
}

export interface ProductVariantPackInput {
  size?: Maybe<Scalars['Float']>;
  unit?: Maybe<Scalars['String']>;
}

export interface Availability {
  __typename?: 'Availability';
  type?: Maybe<Scalars['String']>;
  dayFrom?: Maybe<Scalars['String']>;
  dayTo?: Maybe<Scalars['String']>;
  timeFrom?: Maybe<Scalars['String']>;
  timeTo?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
}

export interface AvailabilityInput {
  type?: Maybe<Scalars['String']>;
  dayFrom?: Maybe<Scalars['String']>;
  dayTo?: Maybe<Scalars['String']>;
  timeFrom?: Maybe<Scalars['String']>;
  timeTo?: Maybe<Scalars['String']>;
  price?: Maybe<Scalars['Float']>;
}

export interface Unit {
  __typename?: 'Unit';
  id: Scalars['ID'];
  groupId: Scalars['ID'];
  isActive?: Maybe<Scalars['Boolean']>;
  isAcceptingOrders?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<LocalizedItem>;
  paymentModes?: Maybe<Array<Maybe<PaymentMode>>>;
  floorMap?: Maybe<FloorMapData>;
  lanes?: Maybe<Array<Maybe<Lane>>>;
  open?: Maybe<DailySchedule>;
  openingHours?: Maybe<WeeklySchedule>;
}

export interface CreateUnitInput {
  groupId: Scalars['ID'];
  isActive?: Maybe<Scalars['Boolean']>;
  isAcceptingOrders?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<LocalizedItemInput>;
  paymentModes?: Maybe<Array<Maybe<PaymentModeInput>>>;
  floorMap?: Maybe<FloorMapDataInput>;
  lanes?: Maybe<Array<Maybe<LaneInput>>>;
  open?: Maybe<DailyScheduleInput>;
  openingHours?: Maybe<WeeklyScheduleInput>;
}

export interface UpdateUnitInput {
  id: Scalars['ID'];
  groupId: Scalars['ID'];
  isActive?: Maybe<Scalars['Boolean']>;
  isAcceptingOrders?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<LocalizedItemInput>;
  paymentModes?: Maybe<Array<Maybe<PaymentModeInput>>>;
  floorMap?: Maybe<FloorMapDataInput>;
  lanes?: Maybe<Array<Maybe<LaneInput>>>;
  open?: Maybe<DailyScheduleInput>;
  openingHours?: Maybe<WeeklyScheduleInput>;
}

export interface DailySchedule {
  __typename?: 'DailySchedule';
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
}

export interface DailyScheduleInput {
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
}

export interface CustomDailySchedule {
  __typename?: 'CustomDailySchedule';
  date?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
}

export interface CustomDailyScheduleInput {
  date?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
}

export interface WeeklySchedule {
  __typename?: 'WeeklySchedule';
  mon?: Maybe<DailySchedule>;
  tue?: Maybe<DailySchedule>;
  wed?: Maybe<DailySchedule>;
  thu?: Maybe<DailySchedule>;
  fri?: Maybe<DailySchedule>;
  sat?: Maybe<DailySchedule>;
  sun?: Maybe<DailySchedule>;
  override?: Maybe<Array<Maybe<CustomDailySchedule>>>;
}

export interface WeeklyScheduleInput {
  mon?: Maybe<DailyScheduleInput>;
  tue?: Maybe<DailyScheduleInput>;
  wed?: Maybe<DailyScheduleInput>;
  thu?: Maybe<DailyScheduleInput>;
  fri?: Maybe<DailyScheduleInput>;
  sat?: Maybe<DailyScheduleInput>;
  sun?: Maybe<DailyScheduleInput>;
  override?: Maybe<Array<Maybe<CustomDailyScheduleInput>>>;
}

export interface PaymentMode {
  __typename?: 'PaymentMode';
  name: Scalars['String'];
  caption?: Maybe<Scalars['String']>;
  method: Scalars['String'];
}

export interface PaymentModeInput {
  name: Scalars['String'];
  caption?: Maybe<Scalars['String']>;
  method: Scalars['String'];
}

export interface FloorMapData {
  __typename?: 'FloorMapData';
  w?: Maybe<Scalars['Int']>;
  h?: Maybe<Scalars['Int']>;
  objects?: Maybe<Array<Maybe<FloorMapDataObject>>>;
}

export interface FloorMapDataInput {
  w?: Maybe<Scalars['Int']>;
  h?: Maybe<Scalars['Int']>;
  objects?: Maybe<Array<Maybe<FloorMapDataObjectInput>>>;
}

export interface FloorMapDataObject {
  __typename?: 'FloorMapDataObject';
  id: Scalars['ID'];
  t: Scalars['String'];
  c?: Maybe<Scalars['String']>;
  w?: Maybe<Scalars['Int']>;
  h?: Maybe<Scalars['Int']>;
  r?: Maybe<Scalars['Int']>;
  a?: Maybe<Scalars['Int']>;
  x: Scalars['Int'];
  y: Scalars['Int'];
  tID?: Maybe<Scalars['String']>;
  sID?: Maybe<Scalars['String']>;
}

export interface FloorMapDataObjectInput {
  id: Scalars['ID'];
  t: Scalars['String'];
  c?: Maybe<Scalars['String']>;
  w?: Maybe<Scalars['Int']>;
  h?: Maybe<Scalars['Int']>;
  r?: Maybe<Scalars['Int']>;
  a?: Maybe<Scalars['Int']>;
  x: Scalars['Int'];
  y: Scalars['Int'];
  tID?: Maybe<Scalars['String']>;
  sID?: Maybe<Scalars['String']>;
}

export interface Lane {
  __typename?: 'Lane';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
}

export interface LaneInput {
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
}

export interface User {
  __typename?: 'User';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  address?: Maybe<Address>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  login?: Maybe<Scalars['String']>;
}

export interface CreateUserInput {
  name?: Maybe<Scalars['String']>;
  address?: Maybe<AddressInput>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  login?: Maybe<Scalars['String']>;
}

export interface UpdateUserInput {
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  address?: Maybe<AddressInput>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  login?: Maybe<Scalars['String']>;
}

export interface Query {
  __typename?: 'Query';
  getAdminUser?: Maybe<AdminUser>;
  getAdminUsers?: Maybe<Array<Maybe<AdminUser>>>;
  getChain?: Maybe<Chain>;
  getGroup?: Maybe<Group>;
  getOrderItem?: Maybe<OrderItem>;
  getOrder?: Maybe<Order>;
  getProductCategory?: Maybe<ProductCategory>;
  getChainProduct?: Maybe<ChainProduct>;
  getUnit?: Maybe<Unit>;
  getUser?: Maybe<User>;
  getCustomerStripeCards?: Maybe<Array<Maybe<StripeCard>>>;
}

export interface QueryGetAdminUserArgs {
  id: Scalars['ID'];
}

export interface QueryGetChainArgs {
  id: Scalars['ID'];
}

export interface QueryGetGroupArgs {
  id: Scalars['ID'];
}

export interface QueryGetOrderItemArgs {
  id: Scalars['ID'];
}

export interface QueryGetOrderArgs {
  id: Scalars['ID'];
}

export interface QueryGetProductCategoryArgs {
  id: Scalars['ID'];
}

export interface QueryGetChainProductArgs {
  id: Scalars['ID'];
}

export interface QueryGetUnitArgs {
  id: Scalars['ID'];
}

export interface QueryGetUserArgs {
  id: Scalars['ID'];
}

export interface QueryGetCustomerStripeCardsArgs {
  userId?: Maybe<Scalars['ID']>;
}

export interface Mutation {
  __typename?: 'Mutation';
  createAdminUser?: Maybe<AdminUser>;
  updateAdminUser?: Maybe<AdminUser>;
  deleteAdminUser: Scalars['Boolean'];
  updateAdminUserRole: Scalars['Boolean'];
  createChain?: Maybe<Chain>;
  updateChain?: Maybe<Chain>;
  deleteChain: Scalars['Boolean'];
  createGroup?: Maybe<Group>;
  updateGroup?: Maybe<Group>;
  deleteGroup: Scalars['Boolean'];
  createOrderItem?: Maybe<OrderItem>;
  updateOrderItem?: Maybe<OrderItem>;
  deleteOrderItem: Scalars['Boolean'];
  createOrder?: Maybe<Order>;
  updateOrder?: Maybe<Order>;
  deleteOrder: Scalars['Boolean'];
  createProductCategory?: Maybe<ProductCategory>;
  updateProductCategory?: Maybe<ProductCategory>;
  deleteProductCategory: Scalars['Boolean'];
  createChainProduct?: Maybe<ChainProduct>;
  updateChainProduct?: Maybe<ChainProduct>;
  deleteChainProduct: Scalars['Boolean'];
  createUnit?: Maybe<Unit>;
  updateUnit?: Maybe<Unit>;
  deleteUnit: Scalars['Boolean'];
  createUser?: Maybe<User>;
  updateUser?: Maybe<User>;
  deleteUser: Scalars['Boolean'];
  startStripePayment: StartStripePaymentOutput;
}

export interface MutationCreateAdminUserArgs {
  input: CreateAdminUserInput;
}

export interface MutationUpdateAdminUserArgs {
  input: UpdateAdminUserInput;
}

export interface MutationDeleteAdminUserArgs {
  id: Scalars['ID'];
}

export interface MutationUpdateAdminUserRoleArgs {
  input: AdminUserRoleInput;
}

export interface MutationCreateChainArgs {
  input: CreateChainInput;
}

export interface MutationUpdateChainArgs {
  input: UpdateChainInput;
}

export interface MutationDeleteChainArgs {
  id: Scalars['ID'];
}

export interface MutationCreateGroupArgs {
  input: CreateGroupInput;
}

export interface MutationUpdateGroupArgs {
  input: UpdateGroupInput;
}

export interface MutationDeleteGroupArgs {
  id: Scalars['ID'];
}

export interface MutationCreateOrderItemArgs {
  input: CreateOrderItemInput;
}

export interface MutationUpdateOrderItemArgs {
  input: UpdateOrderItemInput;
}

export interface MutationDeleteOrderItemArgs {
  id: Scalars['ID'];
}

export interface MutationCreateOrderArgs {
  input: CreateOrderInput;
}

export interface MutationUpdateOrderArgs {
  input: UpdateOrderInput;
}

export interface MutationDeleteOrderArgs {
  id: Scalars['ID'];
}

export interface MutationCreateProductCategoryArgs {
  input: CreateProductCategoryInput;
}

export interface MutationUpdateProductCategoryArgs {
  input: UpdateProductCategoryInput;
}

export interface MutationDeleteProductCategoryArgs {
  id: Scalars['ID'];
}

export interface MutationCreateChainProductArgs {
  input: CreateChainProductInput;
}

export interface MutationUpdateChainProductArgs {
  input: UpdateChainProductInput;
}

export interface MutationDeleteChainProductArgs {
  id: Scalars['ID'];
}

export interface MutationCreateUnitArgs {
  input: CreateUnitInput;
}

export interface MutationUpdateUnitArgs {
  input: UpdateUnitInput;
}

export interface MutationDeleteUnitArgs {
  id: Scalars['ID'];
}

export interface MutationCreateUserArgs {
  input: CreateUserInput;
}

export interface MutationUpdateUserArgs {
  input: UpdateUserInput;
}

export interface MutationDeleteUserArgs {
  id: Scalars['ID'];
}

export interface MutationStartStripePaymentArgs {
  args: StartStripePaymentInput;
}

export interface Subscription {
  __typename?: 'Subscription';
  updatedAdminUser?: Maybe<AdminUser>;
  createdAdminUser?: Maybe<AdminUser>;
  adminUserChanged?: Maybe<AdminUser>;
}

export interface SubscriptionUpdatedAdminUserArgs {
  id: Scalars['ID'];
}

export type GetAdminUserQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetAdminUserQuery = { __typename?: 'Query' } & {
  getAdminUser?: Maybe<
    { __typename?: 'AdminUser' } & AdminUserFragmentFragment
  >;
};

export type GetAdminUsersQueryVariables = Exact<{
  id: Scalars['ID'];
}>;

export type GetAdminUsersQuery = { __typename?: 'Query' } & {
  getAdminUsers?: Maybe<
    Array<Maybe<{ __typename?: 'AdminUser' } & AdminUserFragmentFragment>>
  >;
};

export type CreateAdminUserMutationVariables = Exact<{
  data: CreateAdminUserInput;
}>;

export type CreateAdminUserMutation = { __typename?: 'Mutation' } & {
  createAdminUser?: Maybe<
    { __typename?: 'AdminUser' } & AdminUserFragmentFragment
  >;
};

export type UpdateAdminUserMutationVariables = Exact<{
  data: UpdateAdminUserInput;
}>;

export type UpdateAdminUserMutation = { __typename?: 'Mutation' } & {
  updateAdminUser?: Maybe<
    { __typename?: 'AdminUser' } & AdminUserFragmentFragment
  >;
};

export type UpdateAdminUserRoleMutationVariables = Exact<{
  data: AdminUserRoleInput;
}>;

export type UpdateAdminUserRoleMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'updateAdminUserRole'
>;

export type AdminUserFragmentFragment = { __typename?: 'AdminUser' } & Pick<
  AdminUser,
  'id' | 'email' | 'name' | 'phone' | 'profileImage'
> & {
    roles: { __typename?: 'AdminUserRole' } & Pick<AdminUserRole, 'role'> & {
        entities?: Maybe<
          Array<
            Maybe<
              { __typename?: 'AdminRoleEntity' } & Pick<
                AdminRoleEntity,
                'chainId' | 'groupId' | 'unitId'
              >
            >
          >
        >;
      };
    address?: Maybe<
      { __typename?: 'Address' } & Pick<
        Address,
        'address' | 'city' | 'country' | 'postalCode' | 'title'
      > & {
          location?: Maybe<
            { __typename?: 'Location' } & Pick<Location, 'lat' | 'lng'>
          >;
        }
    >;
  };

export type GetCustomerStripeCardsQueryVariables = Exact<{
  userId: Scalars['ID'];
}>;

export type GetCustomerStripeCardsQuery = { __typename?: 'Query' } & {
  getCustomerStripeCards?: Maybe<
    Array<
      Maybe<
        { __typename?: 'StripeCard' } & Pick<
          StripeCard,
          | 'brand'
          | 'id'
          | 'country'
          | 'last4'
          | 'exp_year'
          | 'exp_month'
          | 'fingerprint'
          | 'three_d_secure'
        > & {
            metadata: Array<
              { __typename?: 'StripeMetadata' } & Pick<
                StripeMetadata,
                'key' | 'value'
              >
            >;
          }
      >
    >
  >;
};

export type StartStripePaymentMutationVariables = Exact<{
  args: StartStripePaymentInput;
}>;

export type StartStripePaymentMutation = { __typename?: 'Mutation' } & {
  startStripePayment: { __typename?: 'StartStripePaymentOutput' } & Pick<
    StartStripePaymentOutput,
    'clientSecret' | 'status'
  >;
};

export const AdminUserFragment = gql`
  fragment adminUserFragment on AdminUser {
    id
    email
    name
    phone
    profileImage
    roles {
      role
      entities {
        chainId
        groupId
        unitId
      }
    }
    address {
      address
      city
      country
      location {
        lat
        lng
      }
      postalCode
      title
    }
  }
`;
export const GetAdminUser = gql`
  query GetAdminUser($id: ID!) {
    getAdminUser(id: $id) {
      ...adminUserFragment
    }
  }
  ${AdminUserFragment}
`;
export const GetAdminUsers = gql`
  query GetAdminUsers($id: ID!) {
    getAdminUsers {
      ...adminUserFragment
    }
  }
  ${AdminUserFragment}
`;
export const CreateAdminUser = gql`
  mutation CreateAdminUser($data: CreateAdminUserInput!) {
    createAdminUser(input: $data) {
      ...adminUserFragment
    }
  }
  ${AdminUserFragment}
`;
export const UpdateAdminUser = gql`
  mutation UpdateAdminUser($data: UpdateAdminUserInput!) {
    updateAdminUser(input: $data) {
      ...adminUserFragment
    }
  }
  ${AdminUserFragment}
`;
export const UpdateAdminUserRole = gql`
  mutation UpdateAdminUserRole($data: AdminUserRoleInput!) {
    updateAdminUserRole(input: $data)
  }
`;
export const GetCustomerStripeCards = gql`
  query GetCustomerStripeCards($userId: ID!) {
    getCustomerStripeCards(userId: $userId) {
      brand
      id
      country
      last4
      exp_year
      exp_month
      fingerprint
      three_d_secure
      metadata {
        key
        value
      }
    }
  }
`;
export const StartStripePayment = gql`
  mutation StartStripePayment($args: StartStripePaymentInput!) {
    startStripePayment(args: $args) {
      clientSecret
      status
    }
  }
`;
