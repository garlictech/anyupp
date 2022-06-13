import { DEFAULT_LANE_COLOR } from '../../../shared/utils';
import {
  FloorMapOrderObjects,
  FloorMapUserOrderObjects,
  FloorMapUserOrders,
  LaneOrderItem,
} from '@bgap/shared/types';
import { currentStatus, getLowestStatus } from '@bgap/crud-gql/api';
import {
  Order,
  OrderStatus,
  PaymentStatus,
  PaymentType,
  Unit,
} from '@bgap/domain';

export const getNextOrderStatus = (
  currStatus?: OrderStatus,
): OrderStatus | undefined => {
  switch (currStatus) {
    case OrderStatus.none:
      return OrderStatus.placed;
    case OrderStatus.placed:
      return OrderStatus.processing;
    case OrderStatus.processing:
      return OrderStatus.ready;
    case OrderStatus.ready:
      return OrderStatus.served;
    default:
      return;
  }
};

export const getNextOrderItemStatus = (
  currStatus: OrderStatus,
): OrderStatus | undefined => {
  switch (currStatus) {
    case OrderStatus.placed:
      return OrderStatus.processing;
    case OrderStatus.processing:
      return OrderStatus.ready;
    case OrderStatus.ready:
      return OrderStatus.served;
    default:
      return;
  }
};

export const getPrevOrderItemStatus = (
  currStatus?: OrderStatus,
): OrderStatus | undefined => {
  switch (currStatus) {
    case OrderStatus.served:
      return OrderStatus.ready;
    case OrderStatus.ready:
      return OrderStatus.processing;
    case OrderStatus.processing:
      return OrderStatus.placed;
    default:
      return;
  }
};

export const getOrderLaneColor = (
  orderItem: LaneOrderItem,
  unit: Unit,
): string => {
  return unit?.lanes && orderItem.laneId
    ? unit.lanes.find(l => l?.id === orderItem.laneId)?.color ||
        DEFAULT_LANE_COLOR
    : DEFAULT_LANE_COLOR;
};

export const getStatusColor = (status: OrderStatus): string => {
  switch (status) {
    case OrderStatus.none:
      return 'danger';
    case OrderStatus.placed:
      return 'warning';
    case OrderStatus.processing:
      return 'primary';
    case OrderStatus.ready:
      return 'info';
    case OrderStatus.served:
      return 'success';
    case OrderStatus.failed:
      return 'danger';
    case OrderStatus.rejected:
      return 'danger';
    default:
      return '';
  }
};

export const getActiveOrdersByUser = (
  orders: Order[],
): FloorMapUserOrderObjects => {
  const ordersByUser: FloorMapUserOrderObjects = {};

  orders
    // Filter payed/failed served orders - these orders have been archived on another device
    .filter(
      o =>
        !(
          currentStatus(o.statusLog) === OrderStatus.served &&
          (o.transactionStatus === PaymentStatus.success ||
            o.transactionStatus === PaymentStatus.failed)
        ),
    )
    .forEach((order: Order) => {
      if (!ordersByUser[order.userId]) {
        ordersByUser[order.userId] = {
          userId: order.userId,
          orders: [{ ...order }],
          lastOrder: { ...order },
          hasPaymentIntention:
            (order.paymentMode?.type === PaymentType.card ||
              order.paymentMode?.type === PaymentType.cash) &&
            order.transactionStatus === PaymentStatus.waiting_for_payment,
          lowestStatus: currentStatus(order.statusLog),
        };
      } else {
        ordersByUser[order.userId].orders.push({ ...order });
        ordersByUser[order.userId].hasPaymentIntention =
          ordersByUser[order.userId].hasPaymentIntention ||
          ((order.paymentMode?.type === PaymentType.card ||
            order.paymentMode?.type === PaymentType.cash) &&
            order.transactionStatus === PaymentStatus.waiting_for_payment);

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
      lowestStatus: getLowestStatus(
        userOrders.map((o): OrderStatus => o.lowestStatus),
      ),
    };
  });

  return tableSeatOrders;
};
