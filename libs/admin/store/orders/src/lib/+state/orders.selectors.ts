import { ENTITY_NAME } from '@bgap/admin/shared/types';

import * as CrudApi from '@bgap/crud-gql/api';
import { LaneOrderItem } from '@bgap/shared/types';
import { EntitySelectorsFactory } from '@ngrx/data';
import { createSelector } from '@ngrx/store';

export const orderEntitySelectors =
  new EntitySelectorsFactory().create<CrudApi.Order>(ENTITY_NAME.ORDER);

export const getActiveOrderById = (id: string) =>
  createSelector(
    orderEntitySelectors.selectFilteredEntities,
    (orders: CrudApi.Order[]): CrudApi.Order | undefined =>
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

export const getLaneOrderItemsByStatus = (status: CrudApi.OrderStatus) =>
  createSelector(orderEntitySelectors.selectFilteredEntities, orders => {
    const laneOrderItems: CrudApi.OrderItem[] = [];

    orders.forEach(order => {
      laneOrderItems.push(
        ...order.items
          // use "map" first for the correct idx!!!
          .map(
            (orderItem: CrudApi.OrderItem, idx: number): LaneOrderItem => ({
              ...orderItem,
              idx,
            }),
          )
          .filter(
            (orderItem: CrudApi.OrderItem): boolean =>
              CrudApi.currentStatus(orderItem.statusLog) === status,
          )
          .map((orderItem: CrudApi.OrderItem) => ({
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
