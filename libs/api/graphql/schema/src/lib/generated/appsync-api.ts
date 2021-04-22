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

export interface Location {
  __typename?: 'Location';
  lat: Scalars['Float'];
  lng: Scalars['Float'];
}

export interface LocationInput {
  lat: Scalars['Float'];
  lng: Scalars['Float'];
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

export interface LocalizedItem {
  __typename?: 'LocalizedItem';
  en?: Maybe<Scalars['String']>;
  de?: Maybe<Scalars['String']>;
  hu?: Maybe<Scalars['String']>;
}

export interface PaymentMode {
  __typename?: 'PaymentMode';
  name: Scalars['String'];
  caption?: Maybe<Scalars['String']>;
  method: PaymentMethod;
}

export enum PaymentMethod {
  cash = 'CASH',
  card = 'CARD',
  inapp = 'INAPP',
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

export interface CreateAdminUserInput {
  email: Scalars['String'];
  phone: Scalars['String'];
  name: Scalars['String'];
}

export interface CreateOrderFromCartInput {
  id: Scalars['ID'];
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

export interface GetUnitsNearLocationInput {
  location: LocationInput;
}

export interface GeoUnit {
  __typename?: 'GeoUnit';
  id: Scalars['ID'];
  groupId: Scalars['ID'];
  chainId: Scalars['ID'];
  name: Scalars['String'];
  address: Address;
  style: ChainStyle;
  paymentModes: Array<PaymentMode>;
  distance: Scalars['Int'];
  openingHours: Scalars['String'];
  currency: Scalars['String'];
}

export interface GeoUnitList {
  __typename?: 'GeoUnitList';
  items?: Maybe<Array<Maybe<GeoUnit>>>;
}

export interface Query {
  __typename?: 'Query';
  getMyStripeCards?: Maybe<Array<Maybe<StripeCard>>>;
  getUnitsNearLocation?: Maybe<GeoUnitList>;
}

export interface QueryGetUnitsNearLocationArgs {
  input: GetUnitsNearLocationInput;
}

export interface Mutation {
  __typename?: 'Mutation';
  createAdminUser: Scalars['ID'];
  deleteAdminUser: Scalars['Boolean'];
  createOrderFromCart: CreateOrderFromCartOutput;
  startStripePayment: StartStripePaymentOutput;
  updateMyStripeCard: StripeCard;
  deleteMyStripeCard: Scalars['Boolean'];
}

export interface MutationCreateAdminUserArgs {
  input: CreateAdminUserInput;
}

export interface MutationDeleteAdminUserArgs {
  userName: Scalars['String'];
}

export interface MutationCreateOrderFromCartArgs {
  input: CreateOrderFromCartInput;
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

export type GetUnitsNearLocationQueryVariables = Exact<{
  input: GetUnitsNearLocationInput;
}>;

export type GetUnitsNearLocationQuery = { __typename?: 'Query' } & {
  getUnitsNearLocation?: Maybe<
    { __typename?: 'GeoUnitList' } & {
      items?: Maybe<
        Array<
          Maybe<
            { __typename?: 'GeoUnit' } & Pick<
              GeoUnit,
              | 'id'
              | 'groupId'
              | 'chainId'
              | 'name'
              | 'distance'
              | 'openingHours'
              | 'currency'
            > & {
                address: { __typename?: 'Address' } & Pick<
                  Address,
                  'address' | 'city' | 'country' | 'title' | 'postalCode'
                > & {
                    location?: Maybe<
                      { __typename?: 'Location' } & Pick<
                        Location,
                        'lat' | 'lng'
                      >
                    >;
                  };
                style: { __typename?: 'ChainStyle' } & {
                  colors: { __typename?: 'ChainStyleColors' } & Pick<
                    ChainStyleColors,
                    | 'backgroundLight'
                    | 'backgroundDark'
                    | 'borderLight'
                    | 'borderDark'
                    | 'disabled'
                    | 'highlight'
                    | 'indicator'
                    | 'textLight'
                    | 'textDark'
                  >;
                  images?: Maybe<
                    { __typename?: 'ChainStyleImages' } & Pick<
                      ChainStyleImages,
                      'header' | 'logo'
                    >
                  >;
                };
                paymentModes: Array<
                  { __typename?: 'PaymentMode' } & Pick<
                    PaymentMode,
                    'name' | 'caption' | 'method'
                  >
                >;
              }
          >
        >
      >;
    }
  >;
};

export type CreateOrderFromCartMutationVariables = Exact<{
  input: CreateOrderFromCartInput;
}>;

export type CreateOrderFromCartMutation = { __typename?: 'Mutation' } & {
  createOrderFromCart: { __typename?: 'CreateOrderFromCartOutput' } & Pick<
    CreateOrderFromCartOutput,
    'id'
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

export const GetUnitsNearLocation = gql`
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
          name
          caption
          method
        }
        distance
        openingHours
        currency
      }
    }
  }
`;
export const CreateOrderFromCart = gql`
  mutation createOrderFromCart($input: CreateOrderFromCartInput!) {
    createOrderFromCart(input: $input) {
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
