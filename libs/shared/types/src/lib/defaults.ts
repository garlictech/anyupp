// Default values for the optional fields

import { OrderMode, OrderStatus, ServingMode } from '@bgap/domain';

export const defaultServingMode: ServingMode = ServingMode.inplace;
export const defaultSupportedServingModes: Array<ServingMode> = [
  defaultServingMode,
];

export const defaultOrderMode: OrderMode = OrderMode.instant;
export const defaultSupportedOrderModes: Array<OrderMode> = [defaultOrderMode];

export const SORTED_ORDER_STATUSES = [
  OrderStatus.none,
  OrderStatus.placed,
  OrderStatus.processing,
  OrderStatus.ready,
  OrderStatus.served,
];
