import * as CrudApi from '@bgap/crud-gql/api';

export interface ExtendedGroupProduct
  extends CrudApi.ChainProduct,
    CrudApi.GroupProduct {}

export interface ExtendedUnitProduct
  extends ExtendedGroupProduct,
    CrudApi.UnitProduct {}
