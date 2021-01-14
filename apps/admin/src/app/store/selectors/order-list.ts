import { EOrderStatus } from '../../shared/enums';
import { ILaneOrderItem, IOrder, IOrderItem } from '../../shared/interfaces';
import { currentStatus as currentStatusFn } from '../../shared/pure/orders';

import {
  createFeatureSelector,
  createSelector,
} from '@ngrx/store';

import { activeOrderListAdapter, historyOrderListAdapter } from '../reducer';
import { IOrderEntityState, IOrderListState } from '../state';

const featureSelector = createFeatureSelector<IOrderListState>('orderList');

// ACTIVE

const activeOrderListSelector = createSelector(
  featureSelector,
  (state: IOrderListState): IOrderEntityState => state.active
);
export const getAllActiveOrders = activeOrderListAdapter.getSelectors(
  activeOrderListSelector
).selectAll;
export const getAllActiveOrderIds = activeOrderListAdapter.getSelectors(
  activeOrderListSelector
).selectIds;
export const getAllActiveOrderCount = activeOrderListAdapter.getSelectors(
  activeOrderListSelector
).selectTotal;

export const getActiveOrderById = (
  id: string
) => {
  return createSelector(
    getAllActiveOrders,
    (orders: IOrder[]): IOrder =>
      orders.find((order): boolean => order._id === id)
  );
};

export const getActiveOrdersByUserId = (
  userId: string
) => {
  return createSelector(getAllActiveOrders, (orders: IOrder[]): IOrder[] =>
    orders.filter((order): boolean => order.userId === userId)
  );
};

export const getActiveOrdersCountByUserId = (
  userId: string
) => {
  return createSelector(
    getAllActiveOrders,
    (orders: IOrder[]): number =>
      (orders.filter((order): boolean => order.userId === userId) || []).length
  );
};

export const getLaneOrderItemsByStatus = (
  status: EOrderStatus
) => {
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
                idx
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
                currentStatus: status
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
  featureSelector,
  (state: IOrderListState): IOrderEntityState => state.history
);
export const getAllHistoryOrders = historyOrderListAdapter.getSelectors(
  historyOrderListSelector
).selectAll;
export const getAllHistoryOrderIds = historyOrderListAdapter.getSelectors(
  historyOrderListSelector
).selectIds;
export const getAllHistoryOrderCount = historyOrderListAdapter.getSelectors(
  historyOrderListSelector
).selectTotal;

export const getHistoryOrderById = (
  id: string
) => {
  return createSelector(
    getAllHistoryOrders,
    (orders: IOrder[]): IOrder =>
      orders.find((order): boolean => order._id === id)
  );
};
