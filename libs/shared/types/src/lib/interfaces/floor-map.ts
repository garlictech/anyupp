import { fabric } from 'fabric';
import { Order, OrderStatus, UnitMapObjectType } from '@bgap/domain';

export interface FloorMapUserOrders {
  userId: string;
  orders: Order[];
  lastOrder: Order;
  hasPaymentIntention: boolean;
  lowestStatus: OrderStatus;
}

export interface FloorMapUserOrderObjects {
  [userId: string]: FloorMapUserOrders;
}

export interface FloorMapOrders {
  tsID: string;
  userOrders: FloorMapUserOrders[];
  hasPaymentIntention?: boolean;
  lowestStatus?: OrderStatus;
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
  type: UnitMapObjectType;
  width: number;
  height: number;
  radius: number;
  angle: number;
  left: number;
  top: number;
  caption: string;
}
