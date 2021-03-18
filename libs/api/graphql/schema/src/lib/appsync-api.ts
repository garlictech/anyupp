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

export interface Query {
  __typename?: 'Query';
  getFoo?: Maybe<Scalars['String']>;
}

export interface Mutation {
  __typename?: 'Mutation';
  createOrderFromCart?: Maybe<Scalars['Boolean']>;
}

export interface MutationCreateOrderFromCartArgs {
  input: CreateOrderFromCartInput;
}
