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
