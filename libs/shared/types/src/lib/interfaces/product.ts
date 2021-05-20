import * as CrudApi from '@bgap/crud-gql/api';

export interface IAllergen {
  id: string;
  idx: number;
}

export interface IProductOrderChangeEvent {
  change: number;
  productId: string;
}

export type Product = CrudApi.UnitProduct &
  CrudApi.ChainProduct &
  CrudApi.GroupProduct;
