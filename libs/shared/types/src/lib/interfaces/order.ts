import { EOrderStatus, EPaymentMethod } from '../enums';
import { ILocalizedItem } from './localized-item';
import { IPaymentMode } from './payment';

export interface IPriceShown {
  currency: string;
  pricePerUnit: number;
  priceSum: number;
  tax: number;
  taxSum: number;
}

export interface IOrderItem {
  created: number;
  productName: ILocalizedItem<string>;
  priceShown: IPriceShown;
  productId: string;
  quantity: number;
  statusLog: IStatusLog;
  variantId: string;
  variantName: ILocalizedItem<string>;
  laneId?: string;
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

export interface IStatusLogItem {
  userId: string;
  status: EOrderStatus;
  ts?: string; // after objectToArray(statusLog, 'ts')
}

export interface IStatusLog {
  [timestamp: number]: IStatusLogItem;
}

export interface IPlace {
  seat: string;
  table: string;
}

export interface IOrders {
  [key: string]: IOrder;
}

export interface IOrder {
  id: string;
  userId: string;
  unitId: string;
  items: IOrderItem[];
  paymentMode: IPaymentMode;
  statusLog: IStatusLog;
  sumPriceShown: IPriceShown;
  takeAway: boolean;
  place: IPlace;
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
