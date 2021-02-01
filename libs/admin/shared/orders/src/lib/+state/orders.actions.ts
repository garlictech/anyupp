import { IOrder } from '@bgap/shared/types';
import { createAction, props } from '@ngrx/store';

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
export const upsertActiveOrder = createAction(
  '[OrderList] Upsert active order',
  props<{ order: IOrder }>()
);
export const removeActiveOrder = createAction(
  '[OrderList] Remove active order',
  props<{ orderId: string }>()
);
export const setAllHistoryOrders = createAction(
  '[OrderList] Set all history orders',
  props<{ orders: IOrder[] }>()
);
export const upsertHistoryOrder = createAction(
  '[OrderList] Upsert history order',
  props<{ order: IOrder }>()
);
export const removeHistoryOrder = createAction(
  '[OrderList] Remove history order',
  props<{ orderId: string }>()
);