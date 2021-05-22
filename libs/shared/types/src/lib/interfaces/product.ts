import * as CrudApi from '@bgap/crud-gql/api';
import { Maybe, Scalars } from '@bgap/crud-gql/api';

export interface IAllergen {
  id: string;
  idx: number;
}

export interface IProductOrderChangeEvent {
  change: number;
  productId: string;
}

// TODO this is a manual "merge" of Unit, Chain, Group procucts
// we must reconsider tis part...
export interface Product {
  id: Scalars['ID'];
  parentId?: Scalars['ID'];
  chainId: Scalars['ID'];
  groupId?: Scalars['ID'];
  unitId?: Scalars['ID'];
  isVisible: Scalars['Boolean'];
  takeaway?: Scalars['Boolean'];
  laneId?: Maybe<Scalars['ID']>;
  position?: Scalars['Int'];
  variants?: Maybe<Array<Maybe<CrudApi.ProductVariant>>>;
  configSets?: Maybe<Array<Maybe<CrudApi.ProductConfigSet>>>;
  createdAt: Scalars['AWSDateTime'];
  updatedAt: Scalars['AWSDateTime'];
  groupProduct?: Maybe<CrudApi.GroupProduct>;
  name?: CrudApi.LocalizedItem;
  description?: Maybe<CrudApi.LocalizedItem>;
  productCategoryId?: Scalars['ID'];
  productType?: Scalars['String'];
  image?: Maybe<Scalars['String']>;
  allergens?: Maybe<Array<Maybe<CrudApi.Allergen>>>;
  tax?: Scalars['Int'];
  chainProduct?: Maybe<CrudApi.ChainProduct>;
}
