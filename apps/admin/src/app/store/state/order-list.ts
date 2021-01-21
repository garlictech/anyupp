import { IOrder } from '@bgap/shared/types/interfaces';

import { EntityState } from '@ngrx/entity';

export type IOrderEntityState = EntityState<IOrder>;

export interface IOrderListState {
  active: IOrderEntityState;
  history: IOrderEntityState;
}
