import { ChainProduct, GroupProduct, UnitProduct } from '@bgap/domain';

export interface ExtendedGroupProduct extends ChainProduct, GroupProduct {}

export interface ExtendedUnitProduct
  extends ExtendedGroupProduct,
    UnitProduct {}
