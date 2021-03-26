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

export interface CreateOrderFromCartInput {
  id: Scalars['ID'];
<<<<<<< HEAD
=======
  name?: Maybe<Scalars['String']>;
  profileImage?: Maybe<Scalars['String']>;
  roles?: Maybe<AdminUserRole>;
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
>>>>>>> a07a47eaec4e1ac32b8c75de1de822f91bac70e2
}

export interface CreateOrderFromCartOutput {
  __typename?: 'CreateOrderFromCartOutput';
  id: Scalars['ID'];
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

export interface StripeMetadata {
  __typename?: 'StripeMetadata';
  key: Scalars['String'];
  value: Scalars['String'];
}

export interface StripeCard {
  __typename?: 'StripeCard';
  brand?: Maybe<CardBrand>;
  country?: Maybe<Scalars['String']>;
  last4?: Maybe<Scalars['String']>;
  exp_month?: Maybe<Scalars['Int']>;
  exp_year?: Maybe<Scalars['Int']>;
  name?: Maybe<Scalars['String']>;
  fingerprint?: Maybe<Scalars['String']>;
  funding?: Maybe<CardFundingType>;
  three_d_secure?: Maybe<Scalars['String']>;
<<<<<<< HEAD
=======
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
>>>>>>> a07a47eaec4e1ac32b8c75de1de822f91bac70e2
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
  getFoo?: Maybe<Scalars['String']>;
}

export interface CreateAdminUserInput {
  email?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface Mutation {
  __typename?: 'Mutation';
<<<<<<< HEAD
  createOrderFromCart?: Maybe<CreateOrderFromCartOutput>;
=======
  createAdminUser: Scalars['ID'];
  deleteAdminUser: Scalars['Boolean'];
>>>>>>> a07a47eaec4e1ac32b8c75de1de822f91bac70e2
  startStripePayment?: Maybe<StartStripePaymentOutput>;
  updateMyStripeCard?: Maybe<StripeCard>;
  deleteMyStripeCard?: Maybe<Scalars['Boolean']>;
}

<<<<<<< HEAD
export interface MutationCreateOrderFromCartArgs {
  input: CreateOrderFromCartInput;
=======
export interface MutationCreateAdminUserArgs {
  input: CreateAdminUserInput;
}

export interface MutationDeleteAdminUserArgs {
  userName: Scalars['String'];
>>>>>>> a07a47eaec4e1ac32b8c75de1de822f91bac70e2
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

export type CreateOrderFromCartMutationVariables = Exact<{
  input: CreateOrderFromCartInput;
}>;

export type CreateOrderFromCartMutation = { __typename?: 'Mutation' } & {
  createOrderFromCart?: Maybe<
    { __typename?: 'CreateOrderFromCartOutput' } & Pick<
      CreateOrderFromCartOutput,
      'id'
    >
  >;
};

<<<<<<< HEAD
export const CreateOrderFromCart = gql`
  mutation createOrderFromCart($input: CreateOrderFromCartInput!) {
    createOrderFromCart(input: $input) {
=======
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
>>>>>>> a07a47eaec4e1ac32b8c75de1de822f91bac70e2
      id
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
