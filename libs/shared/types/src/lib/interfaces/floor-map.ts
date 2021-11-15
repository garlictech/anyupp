import { fabric } from 'fabric';

import * as CrudApi from '@bgap/crud-gql/api';

export interface FloorMapUserOrders {
  userId: string;
  orders: CrudApi.Order[];
  lastOrder: CrudApi.Order;
  hasPaymentIntention: boolean;
  lowestStatus: CrudApi.OrderStatus;
}

export interface FloorMapUserOrderObjects {
  [userId: string]: FloorMapUserOrders;
}

export interface FloorMapOrders {
  tsID: string;
  userOrders: FloorMapUserOrders[];
  hasPaymentIntention?: boolean;
  lowestStatus?: CrudApi.OrderStatus;
}

export interface FloorMapOrderObjects {
  [tableSeatId: string]: FloorMapOrders;
}

export interface FabricObject extends fabric.Object {
  id: string;
}

export interface FabricGroup extends fabric.Group {
  id: string;
}

export interface FabricObjectProperties {
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
