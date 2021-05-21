import { DEFAULT_LANE_COLOR } from '@bgap/admin/shared/utils';
import {
  IFloorMapTableOrderObjects,
  IFloorMapUserOrderObjects,
  IFloorMapUserOrders,
  ILaneOrderItem,
  IOrder,
  IStatusLog,
  IUnit,
} from '@bgap/shared/types';
import { CrudApi } from '@bgap/crud-gql/api';

export const currentStatus = (status: IStatusLog[]): CrudApi.OrderStatus => {
  if (!status || status.length === 0) {
    return CrudApi.OrderStatus.NONE;
  }
  const lastElement = status[status.length - 1];
  return lastElement?.status || CrudApi.OrderStatus.NONE;
};

export const getNextOrderStatus = (
  currStatus: CrudApi.OrderStatus,
): CrudApi.OrderStatus | undefined => {
  switch (currStatus) {
    case CrudApi.OrderStatus.NONE:
      return CrudApi.OrderStatus.PLACED;
    case CrudApi.OrderStatus.PLACED:
      return CrudApi.OrderStatus.PROCESSING;
    case CrudApi.OrderStatus.PROCESSING:
      return CrudApi.OrderStatus.READY;
    case CrudApi.OrderStatus.READY:
      return CrudApi.OrderStatus.SERVED;
    default:
      return;
  }
};

export const getPrevOrderItemStatus = (
  currStatus: CrudApi.OrderStatus,
): CrudApi.OrderStatus | undefined => {
  switch (currStatus) {
    case CrudApi.OrderStatus.SERVED:
      return CrudApi.OrderStatus.READY;
    case CrudApi.OrderStatus.READY:
      return CrudApi.OrderStatus.PROCESSING;
    case CrudApi.OrderStatus.PROCESSING:
      return CrudApi.OrderStatus.PLACED;
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

export const getStatusColor = (status: CrudApi.OrderStatus): string => {
  switch (status) {
    case CrudApi.OrderStatus.NONE:
      return 'danger';
    case CrudApi.OrderStatus.PLACED:
      return 'warning';
    case CrudApi.OrderStatus.PROCESSING:
      return 'primary';
    case CrudApi.OrderStatus.READY:
      return 'info';
    case CrudApi.OrderStatus.SERVED:
      return 'success';
    case CrudApi.OrderStatus.FAILED:
      return 'danger';
    case CrudApi.OrderStatus.REJECTED:
      return 'danger';
    default:
      return '';
  }
};

export const getLowestStatus = (statuses: CrudApi.OrderStatus[]): CrudApi.OrderStatus => {
  const SORTED_ORDER_STATUSES = [
    CrudApi.OrderStatus.PLACED,
    CrudApi.OrderStatus.PROCESSING,
    CrudApi.OrderStatus.READY,
    CrudApi.OrderStatus.SERVED
  ];

  const statusIndices: number[] = statuses
    .map((s: CrudApi.OrderStatus): number => SORTED_ORDER_STATUSES.indexOf(s))
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

      if (order.createdAt > ordersByUser[order.userId].lastOrder.createdAt) {
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
        `${userOrder.lastOrder.place?.table || ''}.${
          userOrder.lastOrder.place?.seat || ''
        }` === tsID,
    );

    tableOrders[tsID] = {
      tsID,
      userOrders,
      hasPaymentIntention: userOrders
        .map((o): boolean => o.hasPaymentIntention)
        .some((i): boolean => !!i),
      lowestStatus: getLowestStatus(
        userOrders.map((o): CrudApi.OrderStatus => o.lowestStatus),
      ),
    };
  });

  return tableOrders;
};
