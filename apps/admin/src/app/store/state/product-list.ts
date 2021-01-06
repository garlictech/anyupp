import { IProduct } from 'src/app/shared/interfaces';

import { EntityState } from '@ngrx/entity';

export interface IProductEntityState extends EntityState<IProduct> {}

export interface IProductListState {
  chainProducts: IProductEntityState;
  groupProducts: IProductEntityState;
  unitProducts: IProductEntityState;
  generatedUnitProducts: IProductEntityState;
}
