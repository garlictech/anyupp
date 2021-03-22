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

export interface Query {
  __typename?: 'Query';
  getFoo?: Maybe<Scalars['String']>;
}

export interface Mutation {
  __typename?: 'Mutation';
  createOrderFromCart?: Maybe<CreateOrderFromCartOutput>;
  startStripePayment?: Maybe<StartStripePaymentOutput>;
  updateMyStripeCard?: Maybe<StripeCard>;
  deleteMyStripeCard?: Maybe<Scalars['Boolean']>;
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

export type CreateOrderFromCartMutationMutationVariables = Exact<{
  input: CreateOrderFromCartInput;
}>;

export type CreateOrderFromCartMutationMutation = {
  __typename?: 'Mutation';
} & {
  createOrderFromCart?: Maybe<
    { __typename?: 'CreateOrderFromCartOutput' } & Pick<
      CreateOrderFromCartOutput,
      'id'
    >
  >;
};

export const CreateOrderFromCartMutation = gql`
  mutation CreateOrderFromCartMutation($input: CreateOrderFromCartInput!) {
    createOrderFromCart(input: $input) {
      id
    }
  }
`;
