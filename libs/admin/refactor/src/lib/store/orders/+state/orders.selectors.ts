import { currentStatus } from '@bgap/crud-gql/api';
import { Order, OrderItem, OrderStatus } from '@bgap/domain';
import { LaneOrderItem } from '@bgap/shared/types';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

import { ENTITY_NAME } from '../../../shared/types';

export const orderEntitySelectors = new EntitySelectorsFactory().create<Order>(
  ENTITY_NAME.ORDER,
);

export const getActiveOrderById = (id: string) =>
  createSelector(
    orderEntitySelectors.selectFilteredEntities,
    (orders: Order[]): Order | undefined =>
      orders.find((order): boolean => order.id === id),
  );

export const getActiveOrdersByUserId = (userId: string) =>
  createSelector(orderEntitySelectors.selectFilteredEntities, orders =>
    orders.filter((order): boolean => order.userId === userId),
  );

export const getActiveOrderIds = createSelector(
  orderEntitySelectors.selectFilteredEntities,
  orders => orders.map(order => order.id),
);

export const getActiveOrdersCountByUserId = (userId: string) =>
  createSelector(
    orderEntitySelectors.selectFilteredEntities,
    orders =>
      (orders.filter((order): boolean => order.userId === userId) || []).length,
  );

export const getLaneOrderItemsByStatus = (status: OrderStatus) =>
  createSelector(orderEntitySelectors.selectFilteredEntities, orders => {
    const laneOrderItems: OrderItem[] = [];

    orders.forEach(order => {
      laneOrderItems.push(
        ...order.items
          // use "map" first for the correct idx!!!
          .map(
            (orderItem: OrderItem, idx: number): LaneOrderItem => ({
              ...orderItem,
              idx,
            }),
          )
          .filter(
            (orderItem: OrderItem): boolean =>
              currentStatus(orderItem.statusLog) === status,
          )
          .map((orderItem: OrderItem) => ({
            ...orderItem,
            orderId: order.id,
            servingMode: order.servingMode,
            userId: order.userId,
            place: order.place,
            currentStatus: status,
          })),
      );
    });

    return laneOrderItems;
  });
