import * as CrudApi from '@bgap/crud-gql/api';
import { createEntityAdapter, EntityAdapter, EntityState } from '@ngrx/entity';
import {
  Action,
  ActionReducerMap,
  combineReducers,
  createReducer,
  on,
} from '@ngrx/store';

import * as OrdersActions from './orders.actions';

export const ORDERS_FEATURE_KEY = 'orders';

export interface OrderEntityState extends EntityState<CrudApi.Order> {
  error?: string | null; // last known error (if any)
}

export interface OrdersState {
  active: OrderEntityState;
  history: OrderEntityState;
}

export interface OrdersPartialState {
  readonly [ORDERS_FEATURE_KEY]: OrdersState;
}

//
// ACTIVE
//

export const activeOrdersAdapter: EntityAdapter<CrudApi.Order> =
  createEntityAdapter<CrudApi.Order>();

export const initialActiveOrdersState: OrderEntityState =
  activeOrdersAdapter.getInitialState({});

const activeOrdersReducer = createReducer(
  initialActiveOrdersState,
  on(OrdersActions.setAllActiveOrders, (state, { orders }) =>
    activeOrdersAdapter.setAll(orders, state),
  ),
  on(OrdersActions.upsertActiveOrders, (state, { orders }) =>
    activeOrdersAdapter.upsertMany(orders, state),
  ),
  on(OrdersActions.removeActiveOrder, (state, { orderId }) =>
    activeOrdersAdapter.removeOne(orderId, state),
  ),
  on(OrdersActions.resetActiveOrders, state =>
    activeOrdersAdapter.removeAll(state),
  ),
);

// HISTORY

export const historyOrdersAdapter: EntityAdapter<CrudApi.Order> =
  createEntityAdapter<CrudApi.Order>();

export const initialHistoryOrdersState: OrderEntityState =
  historyOrdersAdapter.getInitialState({});

const historyOrdersReducer = createReducer(
  initialHistoryOrdersState,
  on(OrdersActions.setAllHistoryOrders, (state, { orders }) =>
    historyOrdersAdapter.setAll(orders, state),
  ),
  on(OrdersActions.upsertHistoryOrders, (state, { orders }) =>
    historyOrdersAdapter.upsertMany(orders, state),
  ),
  on(OrdersActions.removeHistoryOrder, (state, { orderId }) =>
    historyOrdersAdapter.removeOne(orderId, state),
  ),
  on(OrdersActions.resetHistoryOrders, state =>
    historyOrdersAdapter.removeAll(state),
  ),
);

const reducerMap: ActionReducerMap<OrdersState> = {
  active: activeOrdersReducer,
  history: historyOrdersReducer,
};

const combinedReducer = combineReducers(reducerMap);

export function ordersReducer(state: OrdersState | undefined, action: Action) {
  return combinedReducer(state, action);
}
