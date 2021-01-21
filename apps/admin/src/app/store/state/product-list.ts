import { IProduct } from '@bgap/shared/types';

import { EntityState } from '@ngrx/entity';

export type IProductEntityState = EntityState<IProduct>;

export interface IProductListState {
  chainProducts: IProductEntityState;
  groupProducts: IProductEntityState;
  unitProducts: IProductEntityState;
  generatedUnitProducts: IProductEntityState;
}
