// Default values for the optional fields
import * as CrudApi from '@bgap/crud-gql/api';

export const defaultServingMode: CrudApi.ServingMode =
  CrudApi.ServingMode.inplace;
export const defaultSupportedServingModes: Array<CrudApi.ServingMode> = [
  defaultServingMode,
];

export const defaultOrderMode: CrudApi.OrderMode = CrudApi.OrderMode.instant;
export const defaultSupportedOrderModes: Array<CrudApi.OrderMode> = [
  defaultOrderMode,
];

export const SORTED_ORDER_STATUSES = [
  CrudApi.OrderStatus.none,
  CrudApi.OrderStatus.placed,
  CrudApi.OrderStatus.processing,
  CrudApi.OrderStatus.ready,
  CrudApi.OrderStatus.served,
];
