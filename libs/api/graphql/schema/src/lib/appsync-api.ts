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
  lat: Scalars['String'];
  lng: Scalars['String'];
}

export interface LocalizedItem {
  __typename?: 'LocalizedItem';
  en?: Maybe<Scalars['String']>;
  de?: Maybe<Scalars['String']>;
  hu?: Maybe<Scalars['String']>;
}

export interface AdminUser {
  __typename?: 'AdminUser';
  id: Scalars['ID'];
  name: Scalars['String'];
  profileImage?: Maybe<Scalars['String']>;
  settings?: Maybe<AdminUserSettings>;
  roles?: Maybe<Array<Maybe<Scalars['ID']>>>;
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

export interface RoleContext {
  __typename?: 'RoleContext';
  contextId: Scalars['String'];
  role: Scalars['String'];
  name?: Maybe<LocalizedItem>;
  chainId?: Maybe<Scalars['String']>;
  groupId?: Maybe<Scalars['String']>;
  unitId?: Maybe<Scalars['String']>;
}

export interface Chain {
  __typename?: 'Chain';
  id: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<LocalizedItem>;
  style: ChainStyle;
  isActive?: Maybe<Scalars['Boolean']>;
  address?: Maybe<Address>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface ChainStyle {
  __typename?: 'ChainStyle';
  colors: ChainStyleColors;
  images?: Maybe<ChainStyleImages>;
}

export interface ChainStyleColors {
  __typename?: 'ChainStyleColors';
  backgroundLight: Scalars['String'];
  backgroundDark: Scalars['String'];
  borderLight: Scalars['String'];
  borderDark: Scalars['String'];
  disabled: Scalars['String'];
  highlight: Scalars['String'];
  indicator: Scalars['String'];
  textLight: Scalars['String'];
  textDark: Scalars['String'];
}

export interface ChainStyleImages {
  __typename?: 'ChainStyleImages';
  header?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
}

export interface Group {
  __typename?: 'Group';
  id: Scalars['ID'];
  chainId: Scalars['ID'];
  name: Scalars['String'];
  description?: Maybe<LocalizedItem>;
  currency: Scalars['String'];
  address?: Maybe<Address>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface StatusLog {
  __typename?: 'StatusLog';
  userId: Scalars['ID'];
  status: Scalars['String'];
  ts: Scalars['Float'];
}

export interface PriceShown {
  __typename?: 'PriceShown';
  currency: Scalars['String'];
  pricePerUnit: Scalars['Float'];
  priceSum: Scalars['Float'];
  tax: Scalars['Int'];
  taxSum: Scalars['Float'];
}

export interface OrderItem {
  __typename?: 'OrderItem';
  created?: Maybe<Scalars['Int']>;
  productName: LocalizedItem;
  priceShown: PriceShown;
  productId: Scalars['ID'];
  quantity: Scalars['Int'];
  statusLog?: Maybe<Array<Maybe<StatusLog>>>;
  variantId: Scalars['ID'];
  variantName: LocalizedItem;
  laneId?: Maybe<Scalars['ID']>;
}

export interface Order {
  __typename?: 'Order';
  id: Scalars['ID'];
  userId: Scalars['ID'];
  unitId: Scalars['ID'];
  items: Array<OrderItem>;
  paymentMode: PaymentMode;
  statusLog: Array<StatusLog>;
  sumPriceShown: PriceShown;
  takeAway: Scalars['Boolean'];
  place?: Maybe<Place>;
  paymentIntention?: Maybe<Scalars['Float']>;
}

export interface OrderHistory {
  __typename?: 'OrderHistory';
  id: Scalars['ID'];
  userId: Scalars['ID'];
  unitId: Scalars['ID'];
  items: Array<OrderItem>;
  paymentMode: PaymentMode;
  statusLog: Array<StatusLog>;
  sumPriceShown: PriceShown;
  takeAway: Scalars['Boolean'];
  place?: Maybe<Place>;
  paymentIntention?: Maybe<Scalars['Float']>;
  status?: Maybe<OrderStatus>;
}

export enum OrderStatus {
  none = 'NONE',
  placed = 'PLACED',
  processing = 'PROCESSING',
  ready = 'READY',
  served = 'SERVED',
  waiting_for_payment = 'WAITING_FOR_PAYMENT',
  paid = 'PAID',
  failed = 'FAILED',
  rejected = 'REJECTED',
}

export enum PaymentMethod {
  cash = 'CASH',
  card = 'CARD',
  inapp = 'INAPP',
}

export interface Place {
  __typename?: 'Place';
  seat: Scalars['String'];
  table: Scalars['String'];
}

export interface ProductCategory {
  __typename?: 'ProductCategory';
  id: Scalars['ID'];
  chainId: Scalars['ID'];
  description?: Maybe<LocalizedItem>;
  image?: Maybe<Scalars['String']>;
  name: LocalizedItem;
  position: Scalars['Int'];
}

export interface ChainProduct {
  __typename?: 'ChainProduct';
  id: Scalars['ID'];
  chainId: Scalars['ID'];
  name: LocalizedItem;
  description?: Maybe<LocalizedItem>;
  productCategoryId: Scalars['ID'];
  productType: Scalars['String'];
  isVisible: Scalars['Boolean'];
  image?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
}

export interface GroupProduct {
  __typename?: 'GroupProduct';
  id: Scalars['ID'];
  parentId: Scalars['ID'];
  chainId: Scalars['ID'];
  groupId: Scalars['ID'];
  isVisible: Scalars['Boolean'];
  tax: Scalars['Int'];
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
}

export interface UnitProduct {
  __typename?: 'UnitProduct';
  id: Scalars['ID'];
  parentId: Scalars['ID'];
  chainId: Scalars['ID'];
  groupId: Scalars['ID'];
  unitId: Scalars['ID'];
  isVisible: Scalars['Boolean'];
  takeaway: Scalars['Boolean'];
  laneId?: Maybe<Scalars['ID']>;
  position: Scalars['Int'];
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
}

export interface ProductVariant {
  __typename?: 'ProductVariant';
  id: Scalars['ID'];
  variantName?: Maybe<LocalizedItem>;
  pack?: Maybe<ProductVariantPack>;
  refGroupPrice?: Maybe<Scalars['Float']>;
  isAvailable: Scalars['Boolean'];
  price: Scalars['Float'];
  availabilities?: Maybe<Array<Maybe<Availability>>>;
  position: Scalars['Int'];
}

export interface ProductVariantPack {
  __typename?: 'ProductVariantPack';
  size: Scalars['Float'];
  unit: Scalars['String'];
}

export interface Availability {
  __typename?: 'Availability';
  type: Scalars['String'];
  dayFrom?: Maybe<Scalars['String']>;
  dayTo?: Maybe<Scalars['String']>;
  timeFrom?: Maybe<Scalars['String']>;
  timeTo?: Maybe<Scalars['String']>;
  price: Scalars['Float'];
}

export interface GeneratedProduct {
  __typename?: 'GeneratedProduct';
  id: Scalars['ID'];
  unitId: Scalars['ID'];
  productCategoryId: Scalars['ID'];
  name: LocalizedItem;
  description?: Maybe<LocalizedItem>;
  productType: Scalars['String'];
  tax: Scalars['Int'];
  position: Scalars['Int'];
  image?: Maybe<Scalars['String']>;
  variants: Array<ProductVariant>;
}

export interface FavoriteProduct {
  __typename?: 'FavoriteProduct';
  id: Scalars['ID'];
  userId: Scalars['ID'];
  unitId: Scalars['ID'];
  product?: Maybe<GeneratedProduct>;
}

export interface Unit {
  __typename?: 'Unit';
  id: Scalars['ID'];
  groupId: Scalars['ID'];
  chainId: Scalars['ID'];
  isActive: Scalars['Boolean'];
  isAcceptingOrders: Scalars['Boolean'];
  name: Scalars['String'];
  description?: Maybe<LocalizedItem>;
  address: Address;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  paymentModes?: Maybe<Array<Maybe<PaymentMode>>>;
  floorMap?: Maybe<FloorMapData>;
  lanes?: Maybe<Array<Maybe<Lane>>>;
  open?: Maybe<DateInterval>;
  openingHours?: Maybe<WeeklySchedule>;
}

export interface DateInterval {
  __typename?: 'DateInterval';
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
}

export interface CustomDailySchedule {
  __typename?: 'CustomDailySchedule';
  date?: Maybe<Scalars['String']>;
  from?: Maybe<Scalars['String']>;
  to?: Maybe<Scalars['String']>;
}

export interface WeeklySchedule {
  __typename?: 'WeeklySchedule';
  mon?: Maybe<DateInterval>;
  tue?: Maybe<DateInterval>;
  wed?: Maybe<DateInterval>;
  thu?: Maybe<DateInterval>;
  fri?: Maybe<DateInterval>;
  sat?: Maybe<DateInterval>;
  sun?: Maybe<DateInterval>;
  custom?: Maybe<Array<Maybe<CustomDailySchedule>>>;
}

export interface PaymentMode {
  __typename?: 'PaymentMode';
  name: Scalars['String'];
  caption?: Maybe<Scalars['String']>;
  method: PaymentMethod;
}

export interface FloorMapData {
  __typename?: 'FloorMapData';
  w: Scalars['Int'];
  h: Scalars['Int'];
  objects?: Maybe<Array<FloorMapDataObject>>;
}

export interface FloorMapDataObject {
  __typename?: 'FloorMapDataObject';
  id: Scalars['ID'];
  t: UnitMapObjectType;
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

export enum UnitMapObjectType {
  table_rectangle = 'TABLE_RECTANGLE',
  table_circle = 'TABLE_CIRCLE',
  seat_rectangle = 'SEAT_RECTANGLE',
  seat_circle = 'SEAT_CIRCLE',
  counter = 'COUNTER',
  wall = 'WALL',
  label = 'LABEL',
}

export interface Lane {
  __typename?: 'Lane';
  id: Scalars['ID'];
  name: Scalars['String'];
  color: Scalars['String'];
}

export interface Cart {
  __typename?: 'Cart';
  id: Scalars['ID'];
  userId: Scalars['ID'];
  unitId: Scalars['ID'];
  takeAway: Scalars['Boolean'];
  place?: Maybe<Place>;
  paymentMode?: Maybe<PaymentMode>;
  items: Array<OrderItem>;
}

export interface Subscription {
  __typename?: 'Subscription';
  onAdminUserChange?: Maybe<AdminUser>;
  onAdminUsersChange?: Maybe<AdminUser>;
  onRoleContextsChange?: Maybe<RoleContext>;
  onChainsChange?: Maybe<Chain>;
  onGroupsChange?: Maybe<Group>;
  onUnitsChange?: Maybe<Unit>;
  onProductCategoriesChange?: Maybe<ProductCategory>;
  onChainProductChange?: Maybe<ChainProduct>;
  onGroupProductChange?: Maybe<GroupProduct>;
  onUnitProductChange?: Maybe<UnitProduct>;
  onProductChanged?: Maybe<GeneratedProduct>;
  onOrderChanged?: Maybe<Order>;
}

export interface SubscriptionOnAdminUserChangeArgs {
  id: Scalars['ID'];
}

export interface SubscriptionOnProductChangedArgs {
  unitId?: Maybe<Scalars['String']>;
}

export interface SubscriptionOnOrderChangedArgs {
  userId?: Maybe<Scalars['String']>;
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
  name?: Maybe<Scalars['String']>;
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
  paymentMethodId: Scalars['ID'];
}

export interface StartStripePaymentOutput {
  __typename?: 'StartStripePaymentOutput';
  clientSecret: Scalars['String'];
  status: Scalars['String'];
}

export interface StripeCardUpdateInput {
  id: Scalars['ID'];
  exp_month?: Maybe<Scalars['String']>;
  exp_year?: Maybe<Scalars['String']>;
  default_for_currency?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
}

export interface StripeCardDeleteInput {
  id: Scalars['ID'];
}

export interface Query {
  __typename?: 'Query';
  getMyStripeCards?: Maybe<Array<Maybe<StripeCard>>>;
}

export interface CreateAdminUserInput {
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface Mutation {
  __typename?: 'Mutation';
  createAdminUser: Scalars['ID'];
  deleteAdminUser: Scalars['Boolean'];
  startStripePayment?: Maybe<StartStripePaymentOutput>;
  updateMyStripeCard?: Maybe<StripeCard>;
  deleteMyStripeCard?: Maybe<Scalars['Boolean']>;
}

export interface MutationCreateAdminUserArgs {
  input: CreateAdminUserInput;
}

export interface MutationDeleteAdminUserArgs {
  userName: Scalars['String'];
}

export interface MutationStartStripePaymentArgs {
  input: StartStripePaymentInput;
}

export interface MutationUpdateMyStripeCardArgs {
  input: StripeCardUpdateInput;
}

export interface MutationDeleteMyStripeCardArgs {
  input: StripeCardDeleteInput;
}

export type GetMyStripeCardsQueryVariables = Exact<{ [key: string]: never }>;

export type GetMyStripeCardsQuery = { __typename?: 'Query' } & {
  getMyStripeCards?: Maybe<
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
          | 'name'
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

export type UpdateMyStripeCardMutationVariables = Exact<{
  input: StripeCardUpdateInput;
}>;

export type UpdateMyStripeCardMutation = { __typename?: 'Mutation' } & {
  updateMyStripeCard?: Maybe<
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
      | 'name'
    > & {
        metadata: Array<
          { __typename?: 'StripeMetadata' } & Pick<
            StripeMetadata,
            'key' | 'value'
          >
        >;
      }
  >;
};

export type StartStripePaymentMutationVariables = Exact<{
  input: StartStripePaymentInput;
}>;

export type StartStripePaymentMutation = { __typename?: 'Mutation' } & {
  startStripePayment?: Maybe<
    { __typename?: 'StartStripePaymentOutput' } & Pick<
      StartStripePaymentOutput,
      'clientSecret' | 'status'
    >
  >;
};

export type CreateAdminUserMutationVariables = Exact<{
  input: CreateAdminUserInput;
}>;

export type CreateAdminUserMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'createAdminUser'
>;

export type DeleteAdminUserMutationVariables = Exact<{
  userName: Scalars['String'];
}>;

export type DeleteAdminUserMutation = { __typename?: 'Mutation' } & Pick<
  Mutation,
  'deleteAdminUser'
>;

export const GetMyStripeCards = gql`
  query GetMyStripeCards {
    getMyStripeCards {
      brand
      id
      country
      last4
      exp_year
      exp_month
      fingerprint
      three_d_secure
      name
      metadata {
        key
        value
      }
    }
  }
`;
export const UpdateMyStripeCard = gql`
  mutation UpdateMyStripeCard($input: StripeCardUpdateInput!) {
    updateMyStripeCard(input: $input) {
      brand
      id
      country
      last4
      exp_year
      exp_month
      fingerprint
      three_d_secure
      name
      metadata {
        key
        value
      }
    }
  }
`;
export const StartStripePayment = gql`
  mutation StartStripePayment($input: StartStripePaymentInput!) {
    startStripePayment(input: $input) {
      clientSecret
      status
    }
  }
`;
export const CreateAdminUser = gql`
  mutation CreateAdminUser($input: CreateAdminUserInput!) {
    createAdminUser(input: $input)
  }
`;
export const DeleteAdminUser = gql`
  mutation DeleteAdminUser($userName: String!) {
    deleteAdminUser(userName: $userName)
  }
`;
