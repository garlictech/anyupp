import { IOrder } from 'src/app/shared/interfaces';

import { EntityState } from '@ngrx/entity';

export interface IOrderEntityState extends EntityState<IOrder> {}

export interface IOrderListState {
  active: IOrderEntityState;
  history: IOrderEntityState;
}
