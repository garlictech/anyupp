import { fabric } from 'fabric';

import { EOrderStatus } from '../enums';
import { IOrder } from './order';

export interface IFloorMapDataObject {
  id?: string; // key
  t?: string; // type
  c?: string; // caption
  w?: number; // width
  h?: number; // height
  r?: number; // radius
  a?: number; // angle
  x?: number; // left
  y?: number; // top
  tID?: string; // Table ID
  sID?: string; // Seat Id
  cID?: string; // Seat Id - deprecated
}

export interface IFloorMapData {
  w: number;
  h: number;
  objects: {
    [id: string]: IFloorMapDataObject;
  };
}

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
