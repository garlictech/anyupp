import * as CrudApi from '@bgap/crud-gql/api';

export interface LaneOrderItem extends CrudApi.OrderItem {
  orderId?: string;
  userId?: string;
  idx?: number;
  laneColor?: string;
  image?: string | null;
  place?: CrudApi.Place;
  servingMode?: CrudApi.ServingMode;
  currentStatus?: CrudApi.OrderStatus;
}

export interface Orders {
  [key: string]: CrudApi.Order;
}

export interface DateIntervals {
  from: number;
  to: number;
}

export interface OrderAmounts {
  [id: string]: number;
}

export interface OrderSum {
  selected?: number;
  currency?: string;
  all?: number;
}

export interface OrderAmount {
  [key: string]: number[];
}

export interface ProducMixObjectInfo {
  variantId?: string;
  componentId?: string;
  quantity: number;
  name: CrudApi.LocalizedItem;
}

export interface ProducMixObjectItem extends ProducMixObjectInfo {
  productId: string;
  productType: string;
  variants: {
    [variantId: string]: ProducMixObjectInfo;
  };
  components: {
    [variantId: string]: ProducMixObjectInfo;
  };
}

export interface ProducMixArrayItem extends ProducMixObjectInfo {
  productId: string;
  productType: string;
  variants: ProducMixObjectInfo[];
  components: ProducMixObjectInfo[];
}

export interface ProducMixObject {
  [productId: string]: ProducMixObjectItem;
}

export interface CurrencyValue {
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

export interface OrderHandlerDeps {
  crudSdk: CrudApi.CrudSdk;
  timestamp: () => number;
}
