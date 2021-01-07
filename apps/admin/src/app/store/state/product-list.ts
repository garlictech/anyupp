import { IProduct } from '../../shared/interfaces';

import { EntityState } from '@ngrx/entity';

export type IProductEntityState = EntityState<IProduct>;

export interface IProductListState {
  chainProducts: IProductEntityState;
  groupProducts: IProductEntityState;
  unitProducts: IProductEntityState;
  generatedUnitProducts: IProductEntityState;
}
