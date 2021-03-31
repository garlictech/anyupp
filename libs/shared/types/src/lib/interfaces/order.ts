import * as Joi from 'joi';

import { EOrderStatus } from '../enums';
import { validateSchema } from '../validation/validate';
import { ILocalizedItem, localizedItemSchema } from './localized-item';
import { IPaymentMode, paymentModeSchema } from './payment';

export interface IPriceShown {
  __typename?: 'PriceShown';
  currency: string;
  pricePerUnit: number;
  priceSum: number;
  tax: number;
  taxSum: number;
}

export const priceShownSchema: Joi.SchemaMap<IPriceShown> = {
  __typename: Joi.string().valid('PriceShown').optional(),
  currency: Joi.string().required(),
  pricePerUnit: Joi.number().required(),
  priceSum: Joi.number().required().optional(),
  tax: Joi.number().required(),
  taxSum: Joi.number().required().optional(),
};

export interface IStatusLogItem {
  userId: string;
  status: EOrderStatus;
  ts?: number; // after objectToArray(statusLog, 'ts')
}
export interface IStatusLog {
  [timestamp: number]: IStatusLogItem;
}
export const statusLogSchema = Joi.array();

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
  laneId?: string;
}

export const orderItemSchema: Joi.SchemaMap<IOrderItem> = {
  __typename: Joi.string().valid('OrderItem').optional(),
  created: Joi.number().positive().allow(null),
  productName: localizedItemSchema.required(),
  priceShown: Joi.object(priceShownSchema).required(),
  productId: Joi.string().required(),
  quantity: Joi.number().positive().required(),
  statusLog: statusLogSchema.required(),
  variantId: Joi.string().required(),
  variantName: localizedItemSchema.required(),
  laneId: Joi.string().allow(null),
};

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
export const placeSchema: Joi.SchemaMap<IPlace> = {
  __typename: Joi.string().valid('Place').optional(),
  seat: Joi.string().required(),
  table: Joi.string().required(),
};

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
  place: IPlace;
  paymentIntention?: number;
  createdAt: string;
  updatedAt: string;
}
export const orderSchema: Joi.SchemaMap<IOrder> = {
  __typename: Joi.string().valid('Order').optional(),
  id: Joi.string().required(),
  userId: Joi.string().required(),
  unitId: Joi.string().required(),
  items: Joi.array().items(orderItemSchema),
  paymentMode: Joi.object(paymentModeSchema).required(),
  statusLog: statusLogSchema.required(),
  sumPriceShown: Joi.object(priceShownSchema).required(),
  takeAway: Joi.boolean().required(),
  place: Joi.object(placeSchema).required(),
  paymentIntention: Joi.number().allow(null),
  createdAt: Joi.string().required(),
  updatedAt: Joi.string().required(),
};

export const { validate: validateOrder, isType: isOrder } = validateSchema<
  IOrder
>(orderSchema, 'Order');

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
