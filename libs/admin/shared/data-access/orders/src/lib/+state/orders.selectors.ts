import { currentStatus as currentStatusFn } from '../fn';
import { ILaneOrderItem } from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  activeOrdersAdapter,
  historyOrdersAdapter,
  IOrdersState,
  ORDERS_FEATURE_KEY,
} from './orders.reducer';
import * as CrudApi from '@bgap/crud-gql/api';

export const getOrdersState =
  createFeatureSelector<IOrdersState>(ORDERS_FEATURE_KEY);

// ACTIVE

const activeOrderListSelector = createSelector(
  getOrdersState,
  state => state.active,
);
export const getAllActiveOrders = activeOrdersAdapter.getSelectors(
  activeOrderListSelector,
).selectAll;
export const getAllActiveOrderIds = activeOrdersAdapter.getSelectors(
  activeOrderListSelector,
).selectIds;
export const getAllActiveOrderCount = activeOrdersAdapter.getSelectors(
  activeOrderListSelector,
).selectTotal;

export const getActiveOrderById = (id: string) => {
  return createSelector(getAllActiveOrders, (orders: CrudApi.Order[]):
    | CrudApi.Order
    | undefined => orders.find((order): boolean => order.id === id));
};

export const getActiveOrdersByUserId = (userId: string) => {
  return createSelector(getAllActiveOrders, orders =>
    orders.filter((order): boolean => order.userId === userId),
  );
};

export const getActiveOrdersCountByUserId = (userId: string) => {
  return createSelector(
    getAllActiveOrders,
    orders =>
      (orders.filter((order): boolean => order.userId === userId) || []).length,
  );
};

export const getLaneOrderItemsByStatus = (status: CrudApi.OrderStatus) => {
  return createSelector(getAllActiveOrders, orders => {
    const laneOrderItems: CrudApi.OrderItem[] = [];

    orders.forEach(order => {
      laneOrderItems.push(
        ...order.items
          // use "map" first for the correct idx!!!
          .map(
            (orderItem: CrudApi.OrderItem, idx: number): ILaneOrderItem => ({
              ...orderItem,
              idx,
            }),
          )
          .filter(
            (orderItem: CrudApi.OrderItem): boolean =>
              currentStatusFn(orderItem.statusLog) === status,
          )
          .map((orderItem: CrudApi.OrderItem) => ({
            ...orderItem,
            orderId: order.id,
            userId: order.userId,
            place: order.place,
            currentStatus: status,
          })),
      );
    });

    return laneOrderItems;
  });
};

// HISTORY

const historyOrderListSelector = createSelector(
  getOrdersState,
  state => state.history,
);
export const getAllHistoryOrders = historyOrdersAdapter.getSelectors(
  historyOrderListSelector,
).selectAll;
export const getAllHistoryOrderIds = historyOrdersAdapter.getSelectors(
  historyOrderListSelector,
).selectIds;
export const getAllHistoryOrderCount = historyOrdersAdapter.getSelectors(
  historyOrderListSelector,
).selectTotal;

export const getHistoryOrderById = (id: string) => {
  return createSelector(getAllHistoryOrders, (orders: CrudApi.Order[]):
    | CrudApi.Order
    | undefined => orders.find((order): boolean => order.id === id));
};
