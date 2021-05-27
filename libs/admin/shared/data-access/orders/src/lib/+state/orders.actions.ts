import * as CrudApi from '@bgap/crud-gql/api';
import { createAction, props } from '@ngrx/store';

export const resetActiveOrders = createAction(
  '[OrderList] Reset active orders',
);
export const resetHistoryOrders = createAction(
  '[OrderList] Reset history orders',
);
export const setAllActiveOrders = createAction(
  '[OrderList] Set all active orders',
  props<{ orders: CrudApi.Order[] }>(),
);
export const upsertActiveOrders = createAction(
  '[OrderList] Upsert active orders',
  props<{ orders: CrudApi.Order[] }>(),
);
export const removeActiveOrder = createAction(
  '[OrderList] Remove active order',
  props<{ orderId: string }>(),
);
export const setAllHistoryOrders = createAction(
  '[OrderList] Set all history orders',
  props<{ orders: CrudApi.Order[] }>(),
);
export const upsertHistoryOrders = createAction(
  '[OrderList] Upsert history orders',
  props<{ orders: CrudApi.Order[] }>(),
);
export const removeHistoryOrder = createAction(
  '[OrderList] Remove history order',
  props<{ orderId: string }>(),
);
