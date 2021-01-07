import { createAction, props } from '@ngrx/store';
import { IOrder } from '../../shared/interfaces';

export const resetActiveOrders = createAction(
  '[OrderList] Reset active orders'
);
export const resetHistoryOrders = createAction(
  '[OrderList] Reset history orders'
);
export const setAllActiveOrders = createAction(
  '[OrderList] Set all active orders',
  props<{ orders: IOrder[] }>()
);
export const setAllHistoryOrders = createAction(
  '[OrderList] Set all history orders',
  props<{ orders: IOrder[] }>()
);
