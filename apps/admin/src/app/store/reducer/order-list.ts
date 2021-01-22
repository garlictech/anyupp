import { IOrder } from '@bgap/shared/types';

import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  Action,
  ActionReducer,
  ActionReducerMap,
  combineReducers,
  createReducer,
  on,
} from '@ngrx/store';

import { orderListActions } from '../actions';
import { IOrderListState } from '../state';

// ACTIVE

export const activeOrderListAdapter: EntityAdapter<IOrder> = createEntityAdapter<
  IOrder
>({
  selectId: (item: IOrder): string => item._id,
});
export const activeOrderListInitialState: EntityState<IOrder> = activeOrderListAdapter.getInitialState();

const activeOrderListReducer = createReducer(
  activeOrderListInitialState,
  on(
    orderListActions.setAllActiveOrders,
    (state, { orders }): EntityState<IOrder> =>
      activeOrderListAdapter.setAll(orders, state)
  ),
  on(
    orderListActions.upsertActiveOrder,
    (state, { order }): EntityState<IOrder> =>
      activeOrderListAdapter.upsertOne(order, state)
  ),
  on(
    orderListActions.removeActiveOrder,
    (state, { orderId }): EntityState<IOrder> =>
      activeOrderListAdapter.removeOne(orderId, state)
  ),
  on(
    orderListActions.resetActiveOrders,
    (state): EntityState<IOrder> => activeOrderListAdapter.removeAll(state)
  )
);

// HISTORY

export const historyOrderListAdapter: EntityAdapter<IOrder> = createEntityAdapter<
  IOrder
>({
  selectId: (item: IOrder): string => item._id,
});
export const historyOrderListInitialState: EntityState<IOrder> = historyOrderListAdapter.getInitialState();

const historyOrderListReducer = createReducer(
  historyOrderListInitialState,
  on(
    orderListActions.setAllHistoryOrders,
    (state, { orders }): EntityState<IOrder> =>
      historyOrderListAdapter.setAll(orders, state)
  ),
  on(
    orderListActions.upsertHistoryOrder,
    (state, { order }): EntityState<IOrder> =>
      historyOrderListAdapter.upsertOne(order, state)
  ),
  on(
    orderListActions.removeHistoryOrder,
    (state, { orderId }): EntityState<IOrder> =>
      historyOrderListAdapter.removeOne(orderId, state)
  ),
  on(
    orderListActions.resetHistoryOrders,
    (state): EntityState<IOrder> => historyOrderListAdapter.removeAll(state)
  )
);

const reducerMap: ActionReducerMap<IOrderListState> = {
  active: activeOrderListReducer,
  history: historyOrderListReducer,
};

const reducer: ActionReducer<IOrderListState> = combineReducers(reducerMap);

export function orderListReducer(
  state: IOrderListState | undefined,
  action: Action
): IOrderListState {
  return reducer(state, action);
}
