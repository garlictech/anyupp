import * as CrudApi from '@bgap/crud-gql/api';

export interface IStatusLog {
  userId: string;
  status: CrudApi.OrderStatus;
  ts?: number; // after objectToArray(statusLog, 'ts')
}

export interface ILaneOrderItem extends CrudApi.OrderItem {
  orderId?: string;
  userId?: string;
  idx?: number;
  laneColor?: string;
  image?: string | null;
  place?: CrudApi.Place;
  currentStatus?: CrudApi.OrderStatus;
}

export interface IOrders {
  [key: string]: CrudApi.Order;
}

export interface IDateIntervals {
  from: number;
  to: number;
}

export interface IOrderAmounts {
  [id: string]: number;
}

export interface IOrderSum {
  selected?: number;
  currency?: string;
  all?: number;
}

export interface IOrderAmount {
  [key: string]: number[];
}

export interface ICurrencyValue {
  value: number;
  currency: string;
}

export interface UnpayCategoryStatObjItem {
  category: CrudApi.UnpayCategory;
  count: number;
  sum: number;
  uniqueUsersCount: number;
}

export interface UnpayCategoryStatObj {
  [category: string]: UnpayCategoryStatObjItem;
}
