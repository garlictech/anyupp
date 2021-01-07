import { EOrderStatus } from 'src/app/shared/enums';
import { ILaneOrderItem, IOrder, IOrderItem } from 'src/app/shared/interfaces';
import { currentStatus as currentStatusFn } from 'src/app/shared/pure/orders';

import {
  createFeatureSelector,
  createSelector,
  MemoizedSelector,
} from '@ngrx/store';

import { activeOrderListAdapter, historyOrderListAdapter } from '../reducer';
import { IOrderEntityState, IOrderListState } from '../state';

const featureSelector = createFeatureSelector<IOrderListState>('orderList');

// ACTIVE

const activeOrderListSelector: MemoizedSelector<
  object,
  IOrderEntityState
> = createSelector(
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
): MemoizedSelector<object, IOrder> => {
  return createSelector(
    getAllActiveOrders,
    (orders: IOrder[]): IOrder =>
      orders.find((order): boolean => order._id === id)
  );
};

export const getActiveOrdersByUserId = (
  userId: string
): MemoizedSelector<object, IOrder[]> => {
  return createSelector(getAllActiveOrders, (orders: IOrder[]): IOrder[] =>
    orders.filter((order): boolean => order.userId === userId)
  );
};

export const getActiveOrdersCountByUserId = (
  userId: string
): MemoizedSelector<object, number> => {
  return createSelector(
    getAllActiveOrders,
    (orders: IOrder[]): number =>
      (orders.filter((order): boolean => order.userId === userId) || []).length
  );
};

export const getLaneOrderItemsByStatus = (
  status: EOrderStatus
): MemoizedSelector<object, ILaneOrderItem[]> => {
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
              (orderItem: IOrderItem, idx: number): ILaneOrderItem => ({
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

const historyOrderListSelector: MemoizedSelector<
  object,
  IOrderEntityState
> = createSelector(
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
): MemoizedSelector<object, IOrder> => {
  return createSelector(
    getAllHistoryOrders,
    (orders: IOrder[]): IOrder =>
      orders.find((order): boolean => order._id === id)
  );
};
