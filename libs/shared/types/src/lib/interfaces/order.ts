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

export interface IProducMixObjectInfo {
  variantId?: string;
  componentId?: string;
  quantity: number;
  name: CrudApi.LocalizedItem;
}

export interface IProducMixObjectItem extends IProducMixObjectInfo {
  productId: string;
  productType: string;
  variants: {
    [variantId: string]: IProducMixObjectInfo;
  };
  components: {
    [variantId: string]: IProducMixObjectInfo;
  };
}

export interface IProducMixArrayItem extends IProducMixObjectInfo {
  productId: string;
  productType: string;
  variants: IProducMixObjectInfo[];
  components: IProducMixObjectInfo[];
}

export interface IProducMixObject {
  [productId: string]: IProducMixObjectItem;
}

export interface ICurrencyValue {
  value: number;
  currency: string;
}

export interface UnpayCategoryMethodStatObjItem {
  [mode: string]: number;
}

export interface UnpayCategoryStatObjItem {
  category: CrudApi.UnpayCategory | string;
  count: number;
  sum: number;
  paymentMethodSums: UnpayCategoryMethodStatObjItem;
  uniqueUsersCount: number;
}

export interface UnpayCategoryStatObj {
  [category: string]: UnpayCategoryStatObjItem;
}
