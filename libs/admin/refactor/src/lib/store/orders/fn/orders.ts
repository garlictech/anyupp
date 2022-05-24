import * as CrudApi from '@bgap/crud-gql/api';
import { DEFAULT_LANE_COLOR } from '../../../shared/utils';
import {
  FloorMapOrderObjects,
  FloorMapUserOrderObjects,
  FloorMapUserOrders,
  LaneOrderItem,
} from '@bgap/shared/types';
import { currentStatus } from '@bgap/crud-gql/api';

export const getNextOrderStatus = (
  currStatus?: CrudApi.OrderStatus,
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
  currStatus?: CrudApi.OrderStatus,
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
  orderItem: LaneOrderItem,
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

export const getActiveOrdersByUser = (
  orders: CrudApi.Order[],
): FloorMapUserOrderObjects => {
  const ordersByUser: FloorMapUserOrderObjects = {};

  orders
    // Filter payed/failed served orders - these orders have been archived on another device
    .filter(
      o =>
        !(
          CrudApi.currentStatus(o.statusLog) === CrudApi.OrderStatus.served &&
          (o.transactionStatus === CrudApi.PaymentStatus.success ||
            o.transactionStatus === CrudApi.PaymentStatus.failed)
        ),
    )
    .forEach((order: CrudApi.Order) => {
      if (!ordersByUser[order.userId]) {
        ordersByUser[order.userId] = {
          userId: order.userId,
          orders: [{ ...order }],
          lastOrder: { ...order },
          hasPaymentIntention:
            (order.paymentMode?.type === CrudApi.PaymentType.card ||
              order.paymentMode?.type === CrudApi.PaymentType.cash) &&
            order.transactionStatus ===
              CrudApi.PaymentStatus.waiting_for_payment,
          lowestStatus: currentStatus(order.statusLog),
        };
      } else {
        ordersByUser[order.userId].orders.push({ ...order });
        ordersByUser[order.userId].hasPaymentIntention =
          ordersByUser[order.userId].hasPaymentIntention ||
          ((order.paymentMode?.type === CrudApi.PaymentType.card ||
            order.paymentMode?.type === CrudApi.PaymentType.cash) &&
            order.transactionStatus ===
              CrudApi.PaymentStatus.waiting_for_payment);

        ordersByUser[order.userId].lowestStatus = CrudApi.getLowestStatus([
          ordersByUser[order.userId].lowestStatus,
          currentStatus(order.statusLog),
        ]);
      }
    });

  return ordersByUser;
};

export const getTableOrders = (
  tableIds: string[],
  ordersByUser: FloorMapUserOrderObjects,
): FloorMapOrderObjects => {
  const tableOrders: FloorMapOrderObjects = {};

  tableIds.forEach((tsID: string) => {
    const userOrders = Object.values(ordersByUser).filter(
      (userOrder: FloorMapUserOrders): boolean =>
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
  ordersByUser: FloorMapUserOrderObjects,
): FloorMapOrderObjects => {
  const tableSeatOrders: FloorMapOrderObjects = {};

  tableSeatIds.forEach((tsID: string) => {
    const userOrders = Object.values(ordersByUser).filter(
      (userOrder: FloorMapUserOrders): boolean =>
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
      lowestStatus: CrudApi.getLowestStatus(
        userOrders.map((o): CrudApi.OrderStatus => o.lowestStatus),
      ),
    };
  });

  return tableSeatOrders;
};
