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
  lat?: Maybe<Scalars['String']>;
  lng?: Maybe<Scalars['String']>;
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
  name?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  roles: AdminUserRole;
  settings?: Maybe<AdminUserSettings>;
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

export enum CardBrand {
  amex = 'amex',
  diners = 'diners',
  discover = 'discover',
  jcb = 'jcb',
  mastercard = 'mastercard',
  unionpay = 'unionpay',
  unknown = 'unknown',
  visa = 'visa',
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
  exp_month?: Maybe<Scalars['Int']>;
  exp_year?: Maybe<Scalars['Int']>;
  fingerprint?: Maybe<Scalars['String']>;
  funding?: Maybe<CardFundingType>;
  id: Scalars['ID'];
  last4?: Maybe<Scalars['String']>;
  metadata: Array<StripeMetadata>;
  name?: Maybe<Scalars['String']>;
  object: Scalars['String'];
  three_d_secure?: Maybe<Scalars['String']>;
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
  address?: Maybe<Address>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
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

export interface StatusLog {
  __typename?: 'StatusLog';
  userId?: Maybe<Scalars['ID']>;
  status?: Maybe<Scalars['String']>;
  ts?: Maybe<Scalars['Float']>;
}

export interface PriceShown {
  __typename?: 'PriceShown';
  currency?: Maybe<Scalars['String']>;
  pricePerUnit?: Maybe<Scalars['Float']>;
  priceSum?: Maybe<Scalars['Float']>;
  tax?: Maybe<Scalars['Int']>;
  taxSum?: Maybe<Scalars['Float']>;
}

export interface OrderItem {
  __typename?: 'OrderItem';
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

export interface ProductCategory {
  __typename?: 'ProductCategory';
  id: Scalars['ID'];
  chainId: Scalars['ID'];
  description?: Maybe<LocalizedItem>;
  image?: Maybe<Scalars['String']>;
  name?: Maybe<LocalizedItem>;
  position?: Maybe<Scalars['String']>;
}

export interface ChainProduct {
  __typename?: 'ChainProduct';
  id: Scalars['ID'];
  chainId: Scalars['ID'];
  name?: Maybe<LocalizedItem>;
  description?: Maybe<LocalizedItem>;
  productCategoryId?: Maybe<Scalars['ID']>;
  productType?: Maybe<Scalars['String']>;
  isVisible?: Maybe<Scalars['Boolean']>;
  position?: Maybe<Scalars['String']>;
  image?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
}

export interface GroupProduct {
  __typename?: 'GroupProduct';
  id: Scalars['ID'];
  parentId: Scalars['ID'];
  chainId: Scalars['ID'];
  groupId: Scalars['ID'];
  isVisible?: Maybe<Scalars['Boolean']>;
  tax?: Maybe<Scalars['Int']>;
  position?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
}

export interface UnitProduct {
  __typename?: 'UnitProduct';
  id: Scalars['ID'];
  parentId: Scalars['ID'];
  chainId: Scalars['ID'];
  groupId: Scalars['ID'];
  unitId: Scalars['ID'];
  isVisible?: Maybe<Scalars['Boolean']>;
  takeaway?: Maybe<Scalars['Boolean']>;
  laneId?: Maybe<Scalars['ID']>;
  position?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
}

export interface ProductVariant {
  __typename?: 'ProductVariant';
  id: Scalars['ID'];
  variantName?: Maybe<LocalizedItem>;
  pack?: Maybe<ProductVariantPack>;
  refGroupPrice?: Maybe<Scalars['Float']>;
  isAvailable?: Maybe<Scalars['Boolean']>;
  price?: Maybe<Scalars['Float']>;
  availabilities?: Maybe<Array<Maybe<Availability>>>;
  position?: Maybe<Scalars['String']>;
}

export interface ProductVariantPack {
  __typename?: 'ProductVariantPack';
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

export interface Unit {
  __typename?: 'Unit';
  id: Scalars['ID'];
  groupId: Scalars['ID'];
  chainId: Scalars['ID'];
  isActive?: Maybe<Scalars['Boolean']>;
  isAcceptingOrders?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  description?: Maybe<LocalizedItem>;
  address?: Maybe<Address>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  paymentModes?: Maybe<Array<Maybe<PaymentMode>>>;
  floorMap?: Maybe<FloorMapData>;
  lanes?: Maybe<Array<Maybe<Lane>>>;
  open?: Maybe<DailySchedule>;
  openingHours?: Maybe<WeeklySchedule>;
}

export interface DailySchedule {
  __typename?: 'DailySchedule';
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
  mon?: Maybe<DailySchedule>;
  tue?: Maybe<DailySchedule>;
  wed?: Maybe<DailySchedule>;
  thu?: Maybe<DailySchedule>;
  fri?: Maybe<DailySchedule>;
  sat?: Maybe<DailySchedule>;
  sun?: Maybe<DailySchedule>;
  override?: Maybe<Array<Maybe<CustomDailySchedule>>>;
}

export interface PaymentMode {
  __typename?: 'PaymentMode';
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

export interface Lane {
  __typename?: 'Lane';
  id?: Maybe<Scalars['ID']>;
  name?: Maybe<Scalars['String']>;
  color?: Maybe<Scalars['String']>;
}

export interface User {
  __typename?: 'User';
  id: Scalars['ID'];
  name?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  login?: Maybe<Scalars['String']>;
}

export interface Subscription {
  __typename?: 'Subscription';
  onAdminUserChange?: Maybe<AdminUser>;
  onAdminUsersChange?: Maybe<AdminUser>;
  onChainsChange?: Maybe<Chain>;
  onGroupsChange?: Maybe<Group>;
  onUnitsChange?: Maybe<Unit>;
  onUsersChange?: Maybe<User>;
  onProductCategoriesChange?: Maybe<ProductCategory>;
  onChainProductChange?: Maybe<ChainProduct>;
  onGroupProductChange?: Maybe<GroupProduct>;
  onUnitProductChange?: Maybe<UnitProduct>;
}

export interface SubscriptionOnAdminUserChangeArgs {
  id: Scalars['ID'];
}

export interface StartStripePaymentInput {
  chainId: Scalars['ID'];
  unitId: Scalars['ID'];
  userId: Scalars['ID'];
  paymentMethodId: Scalars['ID'];
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

export interface Mutation {
  __typename?: 'Mutation';
  startStripePayment?: Maybe<StartStripePaymentOutput>;
  updateMyStripeCard?: Maybe<StripeCard>;
  deleteMyStripeCard?: Maybe<Scalars['Boolean']>;
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
