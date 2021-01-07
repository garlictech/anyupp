import { IOrder } from '../../shared/interfaces';

import { EntityState } from '@ngrx/entity';

export type IOrderEntityState = EntityState<IOrder>;

export interface IOrderListState {
  active: IOrderEntityState;
  history: IOrderEntityState;
}
