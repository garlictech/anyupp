import * as CrudApi from '@bgap/crud-gql/api';
import { DEFAULT_LANE_COLOR } from '@bgap/admin/shared/utils';
import {
  IFloorMapOrderObjects,
  IFloorMapUserOrderObjects,
  IFloorMapUserOrders,
  ILaneOrderItem,
} from '@bgap/shared/types';

export const currentStatus = (
  status: CrudApi.StatusLog[],
): CrudApi.OrderStatus => {
  if (!status || status.length === 0) {
    return CrudApi.OrderStatus.none;
  }
  const lastElement = status[status.length - 1];
  return lastElement?.status || CrudApi.OrderStatus.none;
};

export const getNextOrderStatus = (
  currStatus: CrudApi.OrderStatus,
): CrudApi.OrderStatus | undefined => {
  switch (currStatus) {
    case CrudApi.OrderStatus.none:
      return CrudApi.OrderStatus.placed;
    case CrudApi.OrderStatus.placed:
      return CrudApi.OrderStatus.processing;
    case CrudApi.OrderStatus.processing:
      return CrudApi.OrderStatus.ready;
    case CrudApi.OrderStatus.ready:
      return CrudApi.OrderStatus.served;
    default:
      return;
  }
};

export const getNextOrderItemStatus = (
  currStatus: CrudApi.OrderStatus,
): CrudApi.OrderStatus | undefined => {
  switch (currStatus) {
    case CrudApi.OrderStatus.placed:
      return CrudApi.OrderStatus.processing;
    case CrudApi.OrderStatus.processing:
      return CrudApi.OrderStatus.ready;
    case CrudApi.OrderStatus.ready:
      return CrudApi.OrderStatus.served;
    default:
      return;
  }
};

export const getPrevOrderItemStatus = (
  currStatus: CrudApi.OrderStatus,
): CrudApi.OrderStatus | undefined => {
  switch (currStatus) {
    case CrudApi.OrderStatus.served:
      return CrudApi.OrderStatus.ready;
    case CrudApi.OrderStatus.ready:
      return CrudApi.OrderStatus.processing;
    case CrudApi.OrderStatus.processing:
      return CrudApi.OrderStatus.placed;
    default:
      return;
  }
};

export const getOrderLaneColor = (
  orderItem: ILaneOrderItem,
  unit: CrudApi.Unit,
): string => {
  return unit?.lanes && orderItem.laneId
    ? unit.lanes.find(l => l?.id === orderItem.laneId)?.color ||
        DEFAULT_LANE_COLOR
    : DEFAULT_LANE_COLOR;
};

export const getStatusColor = (status: CrudApi.OrderStatus): string => {
  switch (status) {
    case CrudApi.OrderStatus.none:
      return 'danger';
    case CrudApi.OrderStatus.placed:
      return 'warning';
    case CrudApi.OrderStatus.processing:
      return 'primary';
    case CrudApi.OrderStatus.ready:
      return 'info';
    case CrudApi.OrderStatus.served:
      return 'success';
    case CrudApi.OrderStatus.failed:
      return 'danger';
    case CrudApi.OrderStatus.rejected:
      return 'danger';
    default:
      return '';
  }
};

export const getLowestStatus = (
  statuses: CrudApi.OrderStatus[],
): CrudApi.OrderStatus => {
  const SORTED_ORDER_STATUSES = [
    CrudApi.OrderStatus.none,
    CrudApi.OrderStatus.placed,
    CrudApi.OrderStatus.processing,
    CrudApi.OrderStatus.ready,
    CrudApi.OrderStatus.served,
  ];

  const statusIndices: number[] = statuses
    .map((s: CrudApi.OrderStatus): number => SORTED_ORDER_STATUSES.indexOf(s))
    .filter((idx: number): boolean => idx >= 0);

  return SORTED_ORDER_STATUSES[Math.min(...statusIndices)];
};

export const getOrdersByUser = (
  orders: CrudApi.Order[],
): IFloorMapUserOrderObjects => {
  const ordersByUser: IFloorMapUserOrderObjects = {};

  orders.forEach((order: CrudApi.Order): void => {
    if (!ordersByUser[order.userId]) {
      ordersByUser[order.userId] = {
        userId: order.userId,
        orders: [{ ...order }],
        lastOrder: { ...order },
        hasPaymentIntention:
          order.paymentMode.type === CrudApi.PaymentType.card ||
          order.paymentMode.type === CrudApi.PaymentType.cash,
        lowestStatus: currentStatus(order.statusLog),
      };
    } else {
      ordersByUser[order.userId].orders.push({ ...order });
      ordersByUser[order.userId].hasPaymentIntention =
        ordersByUser[order.userId].hasPaymentIntention ||
        order.paymentMode.type === CrudApi.PaymentType.card ||
        order.paymentMode.type === CrudApi.PaymentType.cash;

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
  tableIds: string[],
  ordersByUser: IFloorMapUserOrderObjects,
): IFloorMapOrderObjects => {
  const tableOrders: IFloorMapOrderObjects = {};

  tableIds.forEach((tsID: string): void => {
    const userOrders = Object.values(ordersByUser).filter(
      (userOrder: IFloorMapUserOrders): boolean =>
        userOrder.lastOrder.place?.table === tsID,
    );

    tableOrders[tsID] = {
      tsID,
      userOrders,
    };
  });

  return tableOrders;
};

export const getTableSeatOrders = (
  tableSeatIds: string[],
  ordersByUser: IFloorMapUserOrderObjects,
): IFloorMapOrderObjects => {
  const tableSeatOrders: IFloorMapOrderObjects = {};

  tableSeatIds.forEach((tsID: string): void => {
    const userOrders = Object.values(ordersByUser).filter(
      (userOrder: IFloorMapUserOrders): boolean =>
        `${userOrder.lastOrder.place?.table || ''}.${
          userOrder.lastOrder.place?.seat || ''
        }` === tsID,
    );

    tableSeatOrders[tsID] = {
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

  return tableSeatOrders;
};

export const getOrderStatusByItemsStatus = (order: CrudApi.Order) => {
  const itemsUniqueStatus = [
    ...new Set(order.items.map(i => currentStatus(i.statusLog))),
  ];

  if (itemsUniqueStatus.every(i => i === CrudApi.OrderStatus.served)) {
    return CrudApi.OrderStatus.served;
  } else if (getLowestStatus(itemsUniqueStatus) === CrudApi.OrderStatus.ready) {
    return CrudApi.OrderStatus.ready;
  } else if (
    itemsUniqueStatus.some(i =>
      [
        CrudApi.OrderStatus.processing,
        CrudApi.OrderStatus.ready,
        CrudApi.OrderStatus.served,
      ].includes(i),
    )
  ) {
    return CrudApi.OrderStatus.processing;
  } else {
    return;
  }
};
