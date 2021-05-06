import { CrudApi } from '@bgap/crud-gql/api';
import { EOrderStatus } from '../enums';
import { ILocalizedItem } from './localized-item';
import { IPaymentMode } from './payment';

export interface IPriceShown {
  __typename?: 'PriceShown';
  currency: string;
  pricePerUnit: number;
  priceSum: number;
  tax: number;
  taxSum: number;
}

export interface IStatusLogItem {
  userId: string;
  status: EOrderStatus;
  ts?: number; // after objectToArray(statusLog, 'ts')
}
export interface IStatusLog {
  [timestamp: number]: IStatusLogItem;
}

export interface IOrderItem {
  __typename?: 'OrderItem';
  created: number;
  productName: ILocalizedItem<string>;
  priceShown: IPriceShown;
  productId: string;
  quantity: number;
  statusLog: IStatusLog;
  variantId: string;
  variantName: ILocalizedItem<string>;
  image?: string;
  laneId?: string;
  allergens?: CrudApi.Allergen[];
}

export interface ILaneOrderItem extends IOrderItem {
  orderId?: string;
  userId?: string;
  idx?: number;
  laneColor?: string;
  image?: string;
  place?: IPlace;
  currentStatus?: EOrderStatus;
}

export interface IPlace {
  __typename?: 'Place';
  seat: string;
  table: string;
}

export interface IOrders {
  [key: string]: IOrder;
}

export interface IOrder {
  __typename?: 'Order';
  id: string;
  userId: string;
  unitId: string;
  items: IOrderItem[];
  paymentMode: IPaymentMode;
  statusLog: IStatusLog;
  sumPriceShown: IPriceShown;
  takeAway: boolean;
  place?: IPlace;
  paymentIntention?: number;
  createdAt: string;
  updatedAt: string;
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
