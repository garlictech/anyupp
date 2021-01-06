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

export interface AdminUser {
  __typename?: 'AdminUser';
  email?: Maybe<Scalars['String']>;
  name?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
}

export interface Query {
  __typename?: 'Query';
  hello?: Maybe<Scalars['String']>;
  getAdminUser?: Maybe<AdminUser>;
}

export interface QueryGetAdminUserArgs {
  id: Scalars['String'];
}

export type GetAdminUserQueryVariables = Exact<{
  id: Scalars['String'];
}>;

export type GetAdminUserQuery = { __typename?: 'Query' } & {
  getAdminUser?: Maybe<
    { __typename?: 'AdminUser' } & Pick<AdminUser, 'email' | 'name' | 'phone'>
  >;
};

export const GetAdminUser = gql`
  query GetAdminUser($id: String!) {
    getAdminUser(id: $id) {
      email
      name
      phone
    }
  }
`;
