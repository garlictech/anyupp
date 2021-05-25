import { fabric } from 'fabric';
import * as CrudApi from '@bgap/crud-gql/api';

export interface IFloorMapUserOrders {
  userId: string;
  orders: CrudApi.Order[];
  lastOrder: CrudApi.Order;
  hasPaymentIntention: boolean;
  lowestStatus: CrudApi.OrderStatus;
}

export interface IFloorMapUserOrderObjects {
  [userId: string]: IFloorMapUserOrders;
}

export interface IFloorMapTableOrders {
  tsID: string;
  userOrders: IFloorMapUserOrders[];
  hasPaymentIntention: boolean;
  lowestStatus: CrudApi.OrderStatus;
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
  type: CrudApi.UnitMapObjectType;
  width: number;
  height: number;
  radius: number;
  angle: number;
  left: number;
  top: number;
  caption: string;
}
