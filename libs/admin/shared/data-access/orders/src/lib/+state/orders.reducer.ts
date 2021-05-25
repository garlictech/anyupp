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

export interface IOrderEntityState extends EntityState<CrudApi.Order> {
  error?: string | null; // last known error (if any)
}

export interface IOrdersState {
  active: IOrderEntityState;
  history: IOrderEntityState;
}

export interface OrdersPartialState {
  readonly [ORDERS_FEATURE_KEY]: IOrdersState;
}

//
// ACTIVE
//

export const activeOrdersAdapter: EntityAdapter<CrudApi.Order> = createEntityAdapter<
  CrudApi.Order
>();

export const initialActiveOrdersState: IOrderEntityState = activeOrdersAdapter.getInitialState(
  {},
);

const activeOrdersReducer = createReducer(
  initialActiveOrdersState,
  on(OrdersActions.setAllActiveOrders, (state, { orders }) =>
    activeOrdersAdapter.setAll(orders, state),
  ),
  on(OrdersActions.upsertActiveOrder, (state, { order }) =>
    activeOrdersAdapter.upsertOne(order, state),
  ),
  on(OrdersActions.removeActiveOrder, (state, { orderId }) =>
    activeOrdersAdapter.removeOne(orderId, state),
  ),
  on(OrdersActions.resetActiveOrders, state =>
    activeOrdersAdapter.removeAll(state),
  ),
);

// HISTORY

export const historyOrdersAdapter: EntityAdapter<CrudApi.Order> = createEntityAdapter<
  CrudApi.Order
>();

export const initialHistoryOrdersState: IOrderEntityState = historyOrdersAdapter.getInitialState(
  {},
);

const historyOrdersReducer = createReducer(
  initialHistoryOrdersState,
  on(OrdersActions.setAllHistoryOrders, (state, { orders }) =>
    historyOrdersAdapter.setAll(orders, state),
  ),
  on(OrdersActions.upsertHistoryOrder, (state, { order }) =>
    historyOrdersAdapter.upsertOne(order, state),
  ),
  on(OrdersActions.removeHistoryOrder, (state, { orderId }) =>
    historyOrdersAdapter.removeOne(orderId, state),
  ),
  on(OrdersActions.resetHistoryOrders, state =>
    historyOrdersAdapter.removeAll(state),
  ),
);

const reducerMap: ActionReducerMap<IOrdersState> = {
  active: activeOrdersReducer,
  history: historyOrdersReducer,
};

const combinedReducer = combineReducers(reducerMap);

export function ordersReducer(state: IOrdersState | undefined, action: Action) {
  return combinedReducer(state, action);
}
