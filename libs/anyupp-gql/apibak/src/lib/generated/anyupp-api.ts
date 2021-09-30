import { Observable } from 'rxjs';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export interface Scalars {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  AWSDateTime: unknown;
}

export interface Address {
  address: Scalars['String'];
  city: Scalars['String'];
  country: Scalars['String'];
  location: Location;
  postalCode: Scalars['String'];
  title: Scalars['String'];
}

export enum Allergen {
  celery = 'celery',
  crustaceans = 'crustaceans',
  egg = 'egg',
  fish = 'fish',
  gluten = 'gluten',
  lupin = 'lupin',
  milk = 'milk',
  molluscs = 'molluscs',
  mustard = 'mustard',
  peanut = 'peanut',
  sesame = 'sesame',
  soya = 'soya',
  sulphites = 'sulphites',
  treenuts = 'treenuts'
}

export interface Availability {
  dayFrom?: Maybe<Scalars['String']>;
  dayTo?: Maybe<Scalars['String']>;
  price: Scalars['Float'];
  timeFrom?: Maybe<Scalars['String']>;
  timeTo?: Maybe<Scalars['String']>;
  type: Scalars['String'];
}

export interface AvailabilityInput {
  dayFrom?: Maybe<Scalars['String']>;
  dayTo?: Maybe<Scalars['String']>;
  price: Scalars['Float'];
  timeFrom?: Maybe<Scalars['String']>;
  timeTo?: Maybe<Scalars['String']>;
  type: Scalars['String'];
}

export interface BillingAddress {
  city?: Maybe<Scalars['String']>;
  country?: Maybe<Scalars['String']>;
  line1?: Maybe<Scalars['String']>;
  line2?: Maybe<Scalars['String']>;
  postal_code?: Maybe<Scalars['String']>;
  state?: Maybe<Scalars['String']>;
}

export interface BillingDetails {
  address?: Maybe<BillingAddress>;
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export enum CardBrand {
  amex = 'amex',
  diners = 'diners',
  discover = 'discover',
  jcb = 'jcb',
  mastercard = 'mastercard',
  unionpay = 'unionpay',
  unknown = 'unknown',
  visa = 'visa'
}

export interface CardChecks {
  address_line1_check?: Maybe<Scalars['String']>;
  address_postal_code_check?: Maybe<Scalars['String']>;
  cvc_check?: Maybe<Scalars['String']>;
}

export enum CardFundingType {
  credit = 'credit',
  debit = 'debit',
  prepaid = 'prepaid',
  unknown = 'unknown'
}

export interface ChainProduct {
  allergens?: Maybe<Array<Maybe<Allergen>>>;
  chainId: Scalars['ID'];
  configSets?: Maybe<Array<Maybe<ProductConfigSet>>>;
  description?: Maybe<LocalizedItem>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  isVisible: Scalars['Boolean'];
  name: LocalizedItem;
  productCategoryId: Scalars['ID'];
  productType: Scalars['String'];
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
}

export interface ChainStyle {
  colors: ChainStyleColors;
  images?: Maybe<ChainStyleImages>;
}

export interface ChainStyleColors {
  backgroundDark: Scalars['String'];
  backgroundLight: Scalars['String'];
  borderDark: Scalars['String'];
  borderLight: Scalars['String'];
  disabled: Scalars['String'];
  highlight: Scalars['String'];
  indicator: Scalars['String'];
  textDark: Scalars['String'];
  textLight: Scalars['String'];
}

export interface ChainStyleImages {
  header?: Maybe<Scalars['String']>;
  logo?: Maybe<Scalars['String']>;
}

export interface CreateAdminUserInput {
  email: Scalars['String'];
  name: Scalars['String'];
  phone: Scalars['String'];
}

export interface CreateAnonymUserOutput {
  pwd: Scalars['String'];
  username: Scalars['String'];
}

export interface CreateOrderFromCartInput {
  id: Scalars['ID'];
}

export interface CreateUnitProductInput {
  chainId: Scalars['ID'];
  configSets?: Maybe<Array<Maybe<ProductConfigSetInput>>>;
  groupId: Scalars['ID'];
  id?: Maybe<Scalars['ID']>;
  isVisible: Scalars['Boolean'];
  laneId?: Maybe<Scalars['ID']>;
  parentId: Scalars['ID'];
  position: Scalars['Int'];
  supportedServingModes: Array<ServingMode>;
  takeaway: Scalars['Boolean'];
  unitId: Scalars['ID'];
  variants?: Maybe<Array<Maybe<ProductVariantInput>>>;
}

export interface GeoUnit {
  address: Address;
  chainId: Scalars['ID'];
  currency: Scalars['String'];
  distance: Scalars['Int'];
  groupId: Scalars['ID'];
  id: Scalars['ID'];
  isAcceptingOrders: Scalars['Boolean'];
  name: Scalars['String'];
  /** @deprecated The new and better openingHoursNext7 field should be used instead of this static string */
  openingHours: Scalars['String'];
  openingHoursNext7: Array<OpeningHoursByDate>;
  paymentModes?: Maybe<Array<Maybe<PaymentMode>>>;
  style: ChainStyle;
  supportedOrderModes: Array<OrderMode>;
  supportedServingModes: Array<ServingMode>;
}

export interface GeoUnitList {
  items?: Maybe<Array<Maybe<GeoUnit>>>;
}

export interface GetUnitsNearLocationInput {
  location: LocationInput;
}

export interface GroupProduct {
  chainId: Scalars['ID'];
  configSets?: Maybe<Array<Maybe<ProductConfigSet>>>;
  groupId: Scalars['ID'];
  id: Scalars['ID'];
  isVisible: Scalars['Boolean'];
  parentId: Scalars['ID'];
  takeawayTax?: Maybe<Scalars['Int']>;
  tax: Scalars['Int'];
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
}

export interface LocalizedItem {
  de?: Maybe<Scalars['String']>;
  en?: Maybe<Scalars['String']>;
  hu?: Maybe<Scalars['String']>;
}

export interface LocalizedItemInput {
  de?: Maybe<Scalars['String']>;
  en?: Maybe<Scalars['String']>;
  hu?: Maybe<Scalars['String']>;
}

export interface Location {
  lat: Scalars['Float'];
  lng: Scalars['Float'];
}

export interface LocationInput {
  lat: Scalars['Float'];
  lng: Scalars['Float'];
}

export interface Mutation {
  createAdminUser: Scalars['ID'];
  createAnonymUser: CreateAnonymUserOutput;
  createOrderFromCart: Scalars['ID'];
  createStripeCard: StripeCard;
  createUnitProduct: UnitProduct;
  deleteAdminUser: Scalars['Boolean'];
  deleteMyStripeCard: Scalars['Boolean'];
  deleteUnitProduct: Scalars['Boolean'];
  regenerateUnitData: Scalars['Boolean'];
  startStripePayment: StartStripePaymentOutput;
  updateChainProduct: ChainProduct;
  updateGroupProduct: GroupProduct;
  updateMyStripeCard: StripeCard;
  updateUnitProduct: UnitProduct;
}


export interface MutationCreateAdminUserArgs {
  input: CreateAdminUserInput;
}


export interface MutationCreateOrderFromCartArgs {
  input: CreateOrderFromCartInput;
}


export interface MutationCreateStripeCardArgs {
  input: StripeCardCreateInput;
}


export interface MutationCreateUnitProductArgs {
  input: CreateUnitProductInput;
}


export interface MutationDeleteAdminUserArgs {
  userName: Scalars['String'];
}


export interface MutationDeleteMyStripeCardArgs {
  input: StripeCardDeleteInput;
}


export interface MutationDeleteUnitProductArgs {
  id: Scalars['ID'];
}


export interface MutationRegenerateUnitDataArgs {
  input: RegenerateUnitDataInput;
}


export interface MutationStartStripePaymentArgs {
  input: StartStripePaymentInput;
}


export interface MutationUpdateChainProductArgs {
  input: UpdateChainProductInput;
}


export interface MutationUpdateGroupProductArgs {
  input: UpdateGroupProductInput;
}


export interface MutationUpdateMyStripeCardArgs {
  input: StripeCardUpdateInput;
}


export interface MutationUpdateUnitProductArgs {
  input: UpdateUnitProductInput;
}

export interface OpeningHoursByDate {
  closed: Scalars['Boolean'];
  date: Scalars['String'];
  from?: Maybe<Scalars['Float']>;
  to?: Maybe<Scalars['Float']>;
}

export enum OrderMode {
  instant = 'instant',
  pickup = 'pickup'
}

export enum PaymentMethod {
  card = 'card',
  cash = 'cash',
  inapp = 'inapp'
}

export interface PaymentMode {
  caption?: Maybe<Scalars['String']>;
  method: PaymentMethod;
  type: PaymentType;
}

export enum PaymentType {
  applepay = 'applepay',
  card = 'card',
  cash = 'cash',
  googlepay = 'googlepay',
  simple = 'simple',
  stripe = 'stripe'
}

export interface ProductConfigComponent {
  position: Scalars['Int'];
  price: Scalars['Float'];
  productComponentId: Scalars['ID'];
  refGroupPrice: Scalars['Float'];
}

export interface ProductConfigComponentInput {
  position: Scalars['Int'];
  price: Scalars['Float'];
  productComponentId: Scalars['ID'];
  refGroupPrice: Scalars['Float'];
}

export interface ProductConfigSet {
  items: Array<ProductConfigComponent>;
  position: Scalars['Int'];
  productSetId: Scalars['ID'];
}

export interface ProductConfigSetInput {
  items: Array<ProductConfigComponentInput>;
  position: Scalars['Int'];
  productSetId: Scalars['ID'];
}

export interface ProductVariant {
  availabilities?: Maybe<Array<Maybe<Availability>>>;
  id: Scalars['ID'];
  isAvailable: Scalars['Boolean'];
  pack?: Maybe<ProductVariantPack>;
  position: Scalars['Int'];
  price: Scalars['Float'];
  refGroupPrice?: Maybe<Scalars['Float']>;
  variantName: LocalizedItem;
}

export interface ProductVariantInput {
  availabilities?: Maybe<Array<Maybe<AvailabilityInput>>>;
  id: Scalars['ID'];
  isAvailable: Scalars['Boolean'];
  pack?: Maybe<ProductVariantPackInput>;
  position: Scalars['Int'];
  price: Scalars['Float'];
  refGroupPrice?: Maybe<Scalars['Float']>;
  variantName: LocalizedItemInput;
}

export interface ProductVariantPack {
  size: Scalars['Float'];
  unit: Scalars['String'];
}

export interface ProductVariantPackInput {
  size: Scalars['Float'];
  unit: Scalars['String'];
}

export interface Query {
  getUnitsNearLocation?: Maybe<GeoUnitList>;
  listStripeCards?: Maybe<Array<Maybe<StripeCard>>>;
}


export interface QueryGetUnitsNearLocationArgs {
  input: GetUnitsNearLocationInput;
}

export interface RegenerateUnitDataInput {
  id: Scalars['ID'];
}

export enum ServingMode {
  inplace = 'inPlace',
  takeaway = 'takeAway'
}

export interface StartStripePaymentInput {
  invoiceAddress?: Maybe<UserInvoiceAddress>;
  orderId: Scalars['ID'];
  paymentMethod: PaymentMethod;
  paymentMethodId?: Maybe<Scalars['String']>;
  savePaymentMethod: Scalars['Boolean'];
}

export interface StartStripePaymentOutput {
  clientSecret: Scalars['String'];
  status: Scalars['String'];
}

export interface StripeCard {
  billing_details?: Maybe<BillingDetails>;
  brand?: Maybe<CardBrand>;
  checks?: Maybe<CardChecks>;
  country?: Maybe<Scalars['String']>;
  exp_month?: Maybe<Scalars['Int']>;
  exp_year?: Maybe<Scalars['Int']>;
  fingerprint?: Maybe<Scalars['String']>;
  funding?: Maybe<CardFundingType>;
  id: Scalars['String'];
  last4?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  three_d_secure?: Maybe<Scalars['String']>;
}

export interface StripeCardCreateInput {
  card_number: Scalars['String'];
  cvc: Scalars['String'];
  default_for_currency?: Maybe<Scalars['Boolean']>;
  exp_month: Scalars['Int'];
  exp_year: Scalars['Int'];
  name: Scalars['String'];
}

export interface StripeCardDeleteInput {
  paymentMethodId: Scalars['String'];
}

export interface StripeCardUpdateInput {
  default_for_currency?: Maybe<Scalars['Boolean']>;
  name?: Maybe<Scalars['String']>;
  paymentMethodId: Scalars['String'];
}

export interface UnitProduct {
  chainId: Scalars['ID'];
  configSets?: Maybe<Array<Maybe<ProductConfigSet>>>;
  groupId: Scalars['ID'];
  id: Scalars['ID'];
  isVisible: Scalars['Boolean'];
  laneId?: Maybe<Scalars['ID']>;
  parentId: Scalars['ID'];
  position: Scalars['Int'];
  supportedServingModes: Array<ServingMode>;
  /** @deprecated Use `supportedServingModes`. */
  takeaway: Scalars['Boolean'];
  unitId: Scalars['ID'];
  variants?: Maybe<Array<Maybe<ProductVariant>>>;
}

export interface UpdateChainProductInput {
  allergens?: Maybe<Array<Maybe<Allergen>>>;
  chainId?: Maybe<Scalars['ID']>;
  configSets?: Maybe<Array<Maybe<ProductConfigSetInput>>>;
  description?: Maybe<LocalizedItemInput>;
  id: Scalars['ID'];
  image?: Maybe<Scalars['String']>;
  isVisible?: Maybe<Scalars['Boolean']>;
  name?: Maybe<LocalizedItemInput>;
  productCategoryId?: Maybe<Scalars['ID']>;
  productType?: Maybe<Scalars['String']>;
  variants?: Maybe<Array<Maybe<ProductVariantInput>>>;
}

export interface UpdateGroupProductInput {
  chainId?: Maybe<Scalars['ID']>;
  configSets?: Maybe<Array<Maybe<ProductConfigSetInput>>>;
  groupId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  isVisible?: Maybe<Scalars['Boolean']>;
  parentId?: Maybe<Scalars['ID']>;
  takeawayTax?: Maybe<Scalars['Int']>;
  tax?: Maybe<Scalars['Int']>;
  variants?: Maybe<Array<Maybe<ProductVariantInput>>>;
}

export interface UpdateUnitProductInput {
  chainId?: Maybe<Scalars['ID']>;
  configSets?: Maybe<Array<Maybe<ProductConfigSetInput>>>;
  groupId?: Maybe<Scalars['ID']>;
  id: Scalars['ID'];
  isVisible?: Maybe<Scalars['Boolean']>;
  laneId?: Maybe<Scalars['ID']>;
  parentId?: Maybe<Scalars['ID']>;
  position?: Maybe<Scalars['Int']>;
  supportedServingModes?: Maybe<Array<ServingMode>>;
  takeaway?: Maybe<Scalars['Boolean']>;
  unitId?: Maybe<Scalars['ID']>;
  variants?: Maybe<Array<Maybe<ProductVariantInput>>>;
}

export interface UserInvoiceAddress {
  city: Scalars['String'];
  country: Scalars['String'];
  customerName: Scalars['String'];
  email?: Maybe<Scalars['String']>;
  postalCode: Scalars['String'];
  streetAddress: Scalars['String'];
  taxNumber: Scalars['String'];
}

export type StartStripePaymentMutationVariables = Exact<{
  input: StartStripePaymentInput;
}>;


export type StartStripePaymentMutation = { startStripePayment: { clientSecret: string, status: string } };

export type CreateOrderFromCartMutationVariables = Exact<{
  input: CreateOrderFromCartInput;
}>;


export type CreateOrderFromCartMutation = { createOrderFromCart: string };

export type CreateAdminUserMutationVariables = Exact<{
  input: CreateAdminUserInput;
}>;


export type CreateAdminUserMutation = { createAdminUser: string };

export type DeleteAdminUserMutationVariables = Exact<{
  userName: Scalars['String'];
}>;


export type DeleteAdminUserMutation = { deleteAdminUser: boolean };

export type CreateUnitProductMutationVariables = Exact<{
  input: CreateUnitProductInput;
}>;


export type CreateUnitProductMutation = { createUnitProduct: { chainId: string, groupId: string, isVisible: boolean, id: string, laneId?: Maybe<string>, parentId: string, position: number, takeaway: boolean, unitId: string, variants?: Maybe<Array<Maybe<{ id: string, isAvailable: boolean, refGroupPrice?: Maybe<number>, price: number, position: number, availabilities?: Maybe<Array<Maybe<{ dayFrom?: Maybe<string>, dayTo?: Maybe<string>, price: number, timeFrom?: Maybe<string>, timeTo?: Maybe<string>, type: string }>>>, variantName: { de?: Maybe<string>, hu?: Maybe<string>, en?: Maybe<string> }, pack?: Maybe<{ size: number, unit: string }> }>>> } };

export type UpdateUnitProductMutationVariables = Exact<{
  input: UpdateUnitProductInput;
}>;


export type UpdateUnitProductMutation = { updateUnitProduct: { chainId: string, groupId: string, isVisible: boolean, id: string, laneId?: Maybe<string>, parentId: string, position: number, takeaway: boolean, unitId: string, variants?: Maybe<Array<Maybe<{ id: string, isAvailable: boolean, refGroupPrice?: Maybe<number>, price: number, position: number, availabilities?: Maybe<Array<Maybe<{ dayFrom?: Maybe<string>, dayTo?: Maybe<string>, price: number, timeFrom?: Maybe<string>, timeTo?: Maybe<string>, type: string }>>>, variantName: { de?: Maybe<string>, hu?: Maybe<string>, en?: Maybe<string> }, pack?: Maybe<{ size: number, unit: string }> }>>> } };

export type DeleteUnitProductMutationVariables = Exact<{
  id: Scalars['ID'];
}>;


export type DeleteUnitProductMutation = { deleteUnitProduct: boolean };

export type UpdateChainProductMutationVariables = Exact<{
  input: UpdateChainProductInput;
}>;


export type UpdateChainProductMutation = { updateChainProduct: { id: string, chainId: string, productCategoryId: string, productType: string, isVisible: boolean, image?: Maybe<string>, allergens?: Maybe<Array<Maybe<Allergen>>>, name: { en?: Maybe<string>, de?: Maybe<string>, hu?: Maybe<string> }, description?: Maybe<{ en?: Maybe<string>, de?: Maybe<string>, hu?: Maybe<string> }>, variants?: Maybe<Array<Maybe<{ id: string, refGroupPrice?: Maybe<number>, isAvailable: boolean, price: number, position: number, variantName: { en?: Maybe<string>, de?: Maybe<string>, hu?: Maybe<string> }, pack?: Maybe<{ size: number, unit: string }>, availabilities?: Maybe<Array<Maybe<{ type: string, dayFrom?: Maybe<string>, dayTo?: Maybe<string>, timeFrom?: Maybe<string>, timeTo?: Maybe<string>, price: number }>>> }>>>, configSets?: Maybe<Array<Maybe<{ productSetId: string, position: number, items: Array<{ productComponentId: string, refGroupPrice: number, price: number, position: number }> }>>> } };

export type UpdateGroupProductMutationVariables = Exact<{
  input: UpdateGroupProductInput;
}>;


export type UpdateGroupProductMutation = { updateGroupProduct: { id: string, parentId: string, chainId: string, groupId: string, isVisible: boolean, tax: number, variants?: Maybe<Array<Maybe<{ id: string, refGroupPrice?: Maybe<number>, isAvailable: boolean, price: number, position: number, variantName: { en?: Maybe<string>, de?: Maybe<string>, hu?: Maybe<string> }, pack?: Maybe<{ size: number, unit: string }>, availabilities?: Maybe<Array<Maybe<{ type: string, dayFrom?: Maybe<string>, dayTo?: Maybe<string>, timeFrom?: Maybe<string>, timeTo?: Maybe<string>, price: number }>>> }>>>, configSets?: Maybe<Array<Maybe<{ productSetId: string, position: number, items: Array<{ productComponentId: string, refGroupPrice: number, price: number, position: number }> }>>> } };

export type RegenerateUnitDataMutationVariables = Exact<{
  input: RegenerateUnitDataInput;
}>;


export type RegenerateUnitDataMutation = { regenerateUnitData: boolean };

export type CreateAnonymUserMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateAnonymUserMutation = { createAnonymUser: { username: string, pwd: string } };

export type CreateStripeCardMutationVariables = Exact<{
  input: StripeCardCreateInput;
}>;


export type CreateStripeCardMutation = { createStripeCard: { brand?: Maybe<CardBrand>, country?: Maybe<string>, exp_month?: Maybe<number>, exp_year?: Maybe<number>, fingerprint?: Maybe<string>, funding?: Maybe<CardFundingType>, id: string, last4?: Maybe<string>, name?: Maybe<string>, three_d_secure?: Maybe<string> } };

export type DeleteMyStripeCardMutationVariables = Exact<{
  input: StripeCardDeleteInput;
}>;


export type DeleteMyStripeCardMutation = { deleteMyStripeCard: boolean };

export type UpdateMyStripeCardMutationVariables = Exact<{
  input: StripeCardUpdateInput;
}>;


export type UpdateMyStripeCardMutation = { updateMyStripeCard: { brand?: Maybe<CardBrand>, country?: Maybe<string>, exp_month?: Maybe<number>, exp_year?: Maybe<number>, fingerprint?: Maybe<string>, funding?: Maybe<CardFundingType>, id: string, last4?: Maybe<string>, name?: Maybe<string>, three_d_secure?: Maybe<string> } };

export type GetUnitsNearLocationQueryVariables = Exact<{
  input: GetUnitsNearLocationInput;
}>;


export type GetUnitsNearLocationQuery = { getUnitsNearLocation?: Maybe<{ items?: Maybe<Array<Maybe<{ id: string, groupId: string, chainId: string, name: string, distance: number, openingHours: string, isAcceptingOrders: boolean, currency: string, supportedServingModes: Array<ServingMode>, supportedOrderModes: Array<OrderMode>, address: { address: string, city: string, country: string, title: string, postalCode: string, location: { lat: number, lng: number } }, style: { colors: { backgroundLight: string, backgroundDark: string, borderLight: string, borderDark: string, disabled: string, highlight: string, indicator: string, textLight: string, textDark: string }, images?: Maybe<{ header?: Maybe<string>, logo?: Maybe<string> }> }, paymentModes?: Maybe<Array<Maybe<{ type: PaymentType, caption?: Maybe<string>, method: PaymentMethod }>>>, openingHoursNext7: Array<{ from?: Maybe<number>, to?: Maybe<number>, closed: boolean, date: string }> }>>> }> };

export type ListStripeCardsQueryVariables = Exact<{ [key: string]: never; }>;


export type ListStripeCardsQuery = { listStripeCards?: Maybe<Array<Maybe<{ brand?: Maybe<CardBrand>, country?: Maybe<string>, exp_month?: Maybe<number>, exp_year?: Maybe<number>, fingerprint?: Maybe<string>, funding?: Maybe<CardFundingType>, id: string, last4?: Maybe<string>, name?: Maybe<string>, three_d_secure?: Maybe<string>, billing_details?: Maybe<{ email?: Maybe<string>, name?: Maybe<string>, phone?: Maybe<string>, address?: Maybe<{ city?: Maybe<string>, country?: Maybe<string>, line1?: Maybe<string>, line2?: Maybe<string>, postal_code?: Maybe<string>, state?: Maybe<string> }> }> }>>> };


export const StartStripePaymentDocument = gql`
    mutation StartStripePayment($input: StartStripePaymentInput!) {
  startStripePayment(input: $input) {
    clientSecret
    status
  }
}
    `;
export const CreateOrderFromCartDocument = gql`
    mutation CreateOrderFromCart($input: CreateOrderFromCartInput!) {
  createOrderFromCart(input: $input)
}
    `;
export const CreateAdminUserDocument = gql`
    mutation CreateAdminUser($input: CreateAdminUserInput!) {
  createAdminUser(input: $input)
}
    `;
export const DeleteAdminUserDocument = gql`
    mutation DeleteAdminUser($userName: String!) {
  deleteAdminUser(userName: $userName)
}
    `;
export const CreateUnitProductDocument = gql`
    mutation CreateUnitProduct($input: CreateUnitProductInput!) {
  createUnitProduct(input: $input) {
    chainId
    groupId
    isVisible
    id
    laneId
    parentId
    position
    takeaway
    unitId
    variants {
      availabilities {
        dayFrom
        dayTo
        price
        timeFrom
        timeTo
        type
      }
      id
      isAvailable
      variantName {
        de
        hu
        en
      }
      refGroupPrice
      price
      position
      pack {
        size
        unit
      }
    }
  }
}
    `;
export const UpdateUnitProductDocument = gql`
    mutation UpdateUnitProduct($input: UpdateUnitProductInput!) {
  updateUnitProduct(input: $input) {
    chainId
    groupId
    isVisible
    id
    laneId
    parentId
    position
    takeaway
    unitId
    variants {
      availabilities {
        dayFrom
        dayTo
        price
        timeFrom
        timeTo
        type
      }
      id
      isAvailable
      variantName {
        de
        hu
        en
      }
      refGroupPrice
      price
      position
      pack {
        size
        unit
      }
    }
  }
}
    `;
export const DeleteUnitProductDocument = gql`
    mutation DeleteUnitProduct($id: ID!) {
  deleteUnitProduct(id: $id)
}
    `;
export const UpdateChainProductDocument = gql`
    mutation UpdateChainProduct($input: UpdateChainProductInput!) {
  updateChainProduct(input: $input) {
    id
    chainId
    name {
      en
      de
      hu
    }
    description {
      en
      de
      hu
    }
    productCategoryId
    productType
    isVisible
    image
    variants {
      id
      variantName {
        en
        de
        hu
      }
      pack {
        size
        unit
      }
      refGroupPrice
      isAvailable
      price
      availabilities {
        type
        dayFrom
        dayTo
        timeFrom
        timeTo
        price
      }
      position
    }
    allergens
    configSets {
      productSetId
      items {
        productComponentId
        refGroupPrice
        price
        position
      }
      position
    }
  }
}
    `;
export const UpdateGroupProductDocument = gql`
    mutation UpdateGroupProduct($input: UpdateGroupProductInput!) {
  updateGroupProduct(input: $input) {
    id
    parentId
    chainId
    groupId
    isVisible
    tax
    variants {
      id
      variantName {
        en
        de
        hu
      }
      pack {
        size
        unit
      }
      refGroupPrice
      isAvailable
      price
      availabilities {
        type
        dayFrom
        dayTo
        timeFrom
        timeTo
        price
      }
      position
    }
    configSets {
      productSetId
      items {
        productComponentId
        refGroupPrice
        price
        position
      }
      position
    }
  }
}
    `;
export const RegenerateUnitDataDocument = gql`
    mutation RegenerateUnitData($input: RegenerateUnitDataInput!) {
  regenerateUnitData(input: $input)
}
    `;
export const CreateAnonymUserDocument = gql`
    mutation CreateAnonymUser {
  createAnonymUser {
    username
    pwd
  }
}
    `;
export const CreateStripeCardDocument = gql`
    mutation CreateStripeCard($input: StripeCardCreateInput!) {
  createStripeCard(input: $input) {
    brand
    country
    exp_month
    exp_year
    fingerprint
    funding
    id
    last4
    name
    three_d_secure
  }
}
    `;
export const DeleteMyStripeCardDocument = gql`
    mutation DeleteMyStripeCard($input: StripeCardDeleteInput!) {
  deleteMyStripeCard(input: $input)
}
    `;
export const UpdateMyStripeCardDocument = gql`
    mutation UpdateMyStripeCard($input: StripeCardUpdateInput!) {
  updateMyStripeCard(input: $input) {
    brand
    country
    exp_month
    exp_year
    fingerprint
    funding
    id
    last4
    name
    three_d_secure
  }
}
    `;
export const GetUnitsNearLocationDocument = gql`
    query GetUnitsNearLocation($input: GetUnitsNearLocationInput!) {
  getUnitsNearLocation(input: $input) {
    items {
      id
      groupId
      chainId
      name
      address {
        address
        city
        country
        title
        postalCode
        location {
          lat
          lng
        }
      }
      style {
        colors {
          backgroundLight
          backgroundDark
          borderLight
          borderDark
          disabled
          highlight
          indicator
          textLight
          textDark
        }
        images {
          header
          logo
        }
      }
      paymentModes {
        type
        caption
        method
      }
      distance
      openingHours
      openingHoursNext7 {
        from
        to
        closed
        date
      }
      isAcceptingOrders
      currency
      supportedServingModes
      supportedOrderModes
    }
  }
}
    `;
export const ListStripeCardsDocument = gql`
    query ListStripeCards {
  listStripeCards {
    billing_details {
      address {
        city
        country
        line1
        line2
        postal_code
        state
      }
      email
      name
      phone
    }
    brand
    country
    exp_month
    exp_year
    fingerprint
    funding
    id
    last4
    name
    three_d_secure
  }
}
    `;
export type Requester<C= {}> = <R, V>(doc: DocumentNode, vars?: V, options?: C) => Promise<R> & Observable<R>
export function getSdk<C>(requester: Requester<C>) {
  return {
    StartStripePayment(variables: StartStripePaymentMutationVariables, options?: C): Promise<StartStripePaymentMutation> {
      return requester<StartStripePaymentMutation, StartStripePaymentMutationVariables>(StartStripePaymentDocument, variables, options);
    },
    CreateOrderFromCart(variables: CreateOrderFromCartMutationVariables, options?: C): Promise<CreateOrderFromCartMutation> {
      return requester<CreateOrderFromCartMutation, CreateOrderFromCartMutationVariables>(CreateOrderFromCartDocument, variables, options);
    },
    CreateAdminUser(variables: CreateAdminUserMutationVariables, options?: C): Promise<CreateAdminUserMutation> {
      return requester<CreateAdminUserMutation, CreateAdminUserMutationVariables>(CreateAdminUserDocument, variables, options);
    },
    DeleteAdminUser(variables: DeleteAdminUserMutationVariables, options?: C): Promise<DeleteAdminUserMutation> {
      return requester<DeleteAdminUserMutation, DeleteAdminUserMutationVariables>(DeleteAdminUserDocument, variables, options);
    },
    CreateUnitProduct(variables: CreateUnitProductMutationVariables, options?: C): Promise<CreateUnitProductMutation> {
      return requester<CreateUnitProductMutation, CreateUnitProductMutationVariables>(CreateUnitProductDocument, variables, options);
    },
    UpdateUnitProduct(variables: UpdateUnitProductMutationVariables, options?: C): Promise<UpdateUnitProductMutation> {
      return requester<UpdateUnitProductMutation, UpdateUnitProductMutationVariables>(UpdateUnitProductDocument, variables, options);
    },
    DeleteUnitProduct(variables: DeleteUnitProductMutationVariables, options?: C): Promise<DeleteUnitProductMutation> {
      return requester<DeleteUnitProductMutation, DeleteUnitProductMutationVariables>(DeleteUnitProductDocument, variables, options);
    },
    UpdateChainProduct(variables: UpdateChainProductMutationVariables, options?: C): Promise<UpdateChainProductMutation> {
      return requester<UpdateChainProductMutation, UpdateChainProductMutationVariables>(UpdateChainProductDocument, variables, options);
    },
    UpdateGroupProduct(variables: UpdateGroupProductMutationVariables, options?: C): Promise<UpdateGroupProductMutation> {
      return requester<UpdateGroupProductMutation, UpdateGroupProductMutationVariables>(UpdateGroupProductDocument, variables, options);
    },
    RegenerateUnitData(variables: RegenerateUnitDataMutationVariables, options?: C): Promise<RegenerateUnitDataMutation> {
      return requester<RegenerateUnitDataMutation, RegenerateUnitDataMutationVariables>(RegenerateUnitDataDocument, variables, options);
    },
    CreateAnonymUser(variables?: CreateAnonymUserMutationVariables, options?: C): Promise<CreateAnonymUserMutation> {
      return requester<CreateAnonymUserMutation, CreateAnonymUserMutationVariables>(CreateAnonymUserDocument, variables, options);
    },
    CreateStripeCard(variables: CreateStripeCardMutationVariables, options?: C): Promise<CreateStripeCardMutation> {
      return requester<CreateStripeCardMutation, CreateStripeCardMutationVariables>(CreateStripeCardDocument, variables, options);
    },
    DeleteMyStripeCard(variables: DeleteMyStripeCardMutationVariables, options?: C): Promise<DeleteMyStripeCardMutation> {
      return requester<DeleteMyStripeCardMutation, DeleteMyStripeCardMutationVariables>(DeleteMyStripeCardDocument, variables, options);
    },
    UpdateMyStripeCard(variables: UpdateMyStripeCardMutationVariables, options?: C): Promise<UpdateMyStripeCardMutation> {
      return requester<UpdateMyStripeCardMutation, UpdateMyStripeCardMutationVariables>(UpdateMyStripeCardDocument, variables, options);
    },
    GetUnitsNearLocation(variables: GetUnitsNearLocationQueryVariables, options?: C): Promise<GetUnitsNearLocationQuery> {
      return requester<GetUnitsNearLocationQuery, GetUnitsNearLocationQueryVariables>(GetUnitsNearLocationDocument, variables, options);
    },
    ListStripeCards(variables?: ListStripeCardsQueryVariables, options?: C): Promise<ListStripeCardsQuery> {
      return requester<ListStripeCardsQuery, ListStripeCardsQueryVariables>(ListStripeCardsDocument, variables, options);
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;