import { currentStatus as currentStatusFn } from '../fn';
import {
  EOrderStatus,
  ILaneOrderItem,
  IOrder,
  IOrderItem,
} from '@bgap/shared/types';
import { createFeatureSelector, createSelector } from '@ngrx/store';

import {
  activeOrdersAdapter,
  historyOrdersAdapter,
  IOrderEntityState,
  IOrdersState,
  ORDERS_FEATURE_KEY,
} from './orders.reducer';

// Lookup the 'Orders' feature state managed by NgRx
export const getOrdersState = createFeatureSelector<IOrdersState>(
  ORDERS_FEATURE_KEY
);

// ACTIVE

const activeOrderListSelector = createSelector(
  getOrdersState,
  (state: IOrdersState): IOrderEntityState => state.active
);
export const getAllActiveOrders = activeOrdersAdapter.getSelectors(
  activeOrderListSelector
).selectAll;
export const getAllActiveOrderIds = activeOrdersAdapter.getSelectors(
  activeOrderListSelector
).selectIds;
export const getAllActiveOrderCount = activeOrdersAdapter.getSelectors(
  activeOrderListSelector
).selectTotal;

export const getActiveOrderById = (id: string) => {
  return createSelector(
    getAllActiveOrders,
    (orders: IOrder[]): IOrder =>
      orders.find((order): boolean => order._id === id)
  );
};

export const getActiveOrdersByUserId = (userId: string) => {
  return createSelector(getAllActiveOrders, (orders: IOrder[]): IOrder[] =>
    orders.filter((order): boolean => order.userId === userId)
  );
};

export const getActiveOrdersCountByUserId = (userId: string) => {
  return createSelector(
    getAllActiveOrders,
    (orders: IOrder[]): number =>
      (orders.filter((order): boolean => order.userId === userId) || []).length
  );
};

export const getLaneOrderItemsByStatus = (status: EOrderStatus) => {
  return createSelector(
    getAllActiveOrders,
    (orders: IOrder[]): ILaneOrderItem[] => {
      const laneOrderItems = [];

      orders.forEach((order: IOrder): void => {
        laneOrderItems.push(
          ...order.items
            // use "map" first for the correct idx!!!
            .map(
              (orderItem: IOrderItem, idx: number): ILaneOrderItem => ({
                ...orderItem,
                idx,
              })
            )
            .filter(
              (orderItem: IOrderItem): boolean =>
                currentStatusFn(orderItem.statusLog) === status
            )
            .map(
              (orderItem: IOrderItem): ILaneOrderItem => ({
                ...orderItem,
                orderId: order._id,
                userId: order.userId,
                place: order.place,
                currentStatus: status,
              })
            )
        );
      });

      return laneOrderItems;
    }
  );
};

// HISTORY

const historyOrderListSelector = createSelector(
  getOrdersState,
  (state: IOrdersState): IOrderEntityState => state.history
);
export const getAllHistoryOrders = historyOrdersAdapter.getSelectors(
  historyOrderListSelector
).selectAll;
export const getAllHistoryOrderIds = historyOrdersAdapter.getSelectors(
  historyOrderListSelector
).selectIds;
export const getAllHistoryOrderCount = historyOrdersAdapter.getSelectors(
  historyOrderListSelector
).selectTotal;

export const getHistoryOrderById = (id: string) => {
  return createSelector(
    getAllHistoryOrders,
    (orders: IOrder[]): IOrder =>
      orders.find((order): boolean => order._id === id)
  );
};
