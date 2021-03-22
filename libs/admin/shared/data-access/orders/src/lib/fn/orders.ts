import { DEFAULT_LANE_COLOR } from '@bgap/admin/shared/utils';
import {
  EOrderStatus,
  IFloorMapTableOrderObjects,
  IFloorMapUserOrderObjects,
  IFloorMapUserOrders,
  ILaneOrderItem,
  IOrder,
  IStatusLog,
  IUnit,
} from '@bgap/shared/types';

export const currentStatus = (status: IStatusLog): EOrderStatus => {
  const statusArr = Object.values(status || {});
  const lastElement = statusArr[statusArr.length - 1];

  return lastElement?.status || 'UNDEFINED';
};

export const getNextOrderStatus = (
  currStatus: EOrderStatus,
): EOrderStatus | undefined => {
  switch (currStatus) {
    case EOrderStatus.PLACED:
      return EOrderStatus.PROCESSING;
    case EOrderStatus.PROCESSING:
      return EOrderStatus.READY;
    case EOrderStatus.READY:
      return EOrderStatus.PAID;
    default:
      return;
  }
};

export const getNextOrderItemStatus = (
  currStatus: EOrderStatus,
): EOrderStatus | undefined => {
  switch (currStatus) {
    case EOrderStatus.PLACED:
      return EOrderStatus.PROCESSING;
    case EOrderStatus.PROCESSING:
      return EOrderStatus.READY;
    case EOrderStatus.READY:
      return EOrderStatus.SERVED;
    default:
      return;
  }
};

export const getPrevOrderItemStatus = (
  currStatus: EOrderStatus,
): EOrderStatus | undefined => {
  switch (currStatus) {
    case EOrderStatus.SERVED:
      return EOrderStatus.READY;
    case EOrderStatus.READY:
      return EOrderStatus.PROCESSING;
    case EOrderStatus.PROCESSING:
      return EOrderStatus.PLACED;
    default:
      return;
  }
};

export const getOrderLaneColor = (
  orderItem: ILaneOrderItem,
  unit: IUnit,
): string => {
  return unit?.lanes && orderItem.laneId
    ? unit.lanes.find(l => l.id === orderItem.laneId)?.color ||
        DEFAULT_LANE_COLOR
    : DEFAULT_LANE_COLOR;
};

export const getStatusColor = (status: EOrderStatus): string => {
  switch (status) {
    case EOrderStatus.PLACED:
      return 'warning';
    case EOrderStatus.PROCESSING:
      return 'primary';
    case EOrderStatus.READY:
      return 'info';
    case EOrderStatus.PAID:
      return 'success';
    case EOrderStatus.SERVED:
      return 'success';
    case EOrderStatus.REJECTED:
      return 'danger';
    default:
      return '';
  }
};

export const getLowestStatus = (statuses: EOrderStatus[]): EOrderStatus => {
  const SORTED_ORDER_STATUSES = [
    EOrderStatus.PLACED,
    EOrderStatus.PROCESSING,
    EOrderStatus.READY,
    EOrderStatus.SERVED,
    EOrderStatus.WAITING_FOR_PAYMENT,
    EOrderStatus.PAID,
  ];

  const statusIndices: number[] = statuses
    .map((s: EOrderStatus): number => SORTED_ORDER_STATUSES.indexOf(s))
    .filter((idx: number): boolean => idx >= 0);

  return SORTED_ORDER_STATUSES[Math.min(...statusIndices)];
};

export const getOrdersByUser = (
  orders: IOrder[],
): IFloorMapUserOrderObjects => {
  const ordersByUser: IFloorMapUserOrderObjects = {};

  orders.forEach((order: IOrder): void => {
    if (!ordersByUser[order.userId]) {
      ordersByUser[order.userId] = {
        userId: order.userId,
        orders: [{ ...order }],
        lastOrder: { ...order },
        hasPaymentIntention: (order.paymentIntention || 0) > 0,
        lowestStatus: currentStatus(order.statusLog),
      };
    } else {
      ordersByUser[order.userId].orders.push({ ...order });
      ordersByUser[order.userId].hasPaymentIntention =
        ordersByUser[order.userId].hasPaymentIntention ||
        (order.paymentIntention || 0) > 0;

      if (order.created > ordersByUser[order.userId].lastOrder.created) {
        ordersByUser[order.userId].lastOrder = { ...order };
      }

      ordersByUser[order.userId].lowestStatus = getLowestStatus([
        ordersByUser[order.userId].lowestStatus,
        currentStatus(order.statusLog),
      ]);
    }
  });

  return ordersByUser;
};

export const getTableOrders = (
  tableSeatIds: string[],
  ordersByUser: IFloorMapUserOrderObjects,
): IFloorMapTableOrderObjects => {
  const tableOrders: IFloorMapTableOrderObjects = {};

  tableSeatIds.forEach((tsID: string): void => {
    const userOrders = Object.values(ordersByUser).filter(
      (userOrder: IFloorMapUserOrders): boolean =>
        `${userOrder.lastOrder.place.table}.${userOrder.lastOrder.place.seat}` ===
        tsID,
    );

    tableOrders[tsID] = {
      tsID,
      userOrders,
      hasPaymentIntention: userOrders
        .map((o): boolean => o.hasPaymentIntention)
        .some((i): boolean => !!i),
      lowestStatus: getLowestStatus(
        userOrders.map((o): EOrderStatus => o.lowestStatus),
      ),
    };
  });

  return tableOrders;
};
