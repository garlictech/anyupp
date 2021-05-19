import { fabric } from 'fabric';

import { EOrderStatus } from '../enums';
import { IOrder } from './order';

export interface IFloorMapUserOrders {
  userId: string;
  orders: IOrder[];
  lastOrder: IOrder;
  hasPaymentIntention: boolean;
  lowestStatus: EOrderStatus;
}

export interface IFloorMapUserOrderObjects {
  [userId: string]: IFloorMapUserOrders;
}

export interface IFloorMapTableOrders {
  tsID: string;
  userOrders: IFloorMapUserOrders[];
  hasPaymentIntention: boolean;
  lowestStatus: EOrderStatus;
}

export interface IFloorMapTableOrderObjects {
  [tableSeatId: string]: IFloorMapTableOrders;
}

export interface IFabricObject extends fabric.Object {
  id: string;
}

export interface IFabricGroup extends fabric.Group {
  id: string;
}

export interface IFabricObjectProperties {
  id: string;
  type: string;
  width: number;
  height: number;
  radius: number;
  angle: number;
  left: number;
  top: number;
  caption: string;
}
