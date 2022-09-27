import { OrderStatus } from '@bgap/domain';
import { PushNotificationData } from '../PushNotificationData';
import { PushNotificationTypes } from '../PushNotificationTypes';

interface Params {
  orderId: string;
  orderStatus: OrderStatus;
  orderNum?: string | null;
  unitId: string;
}

export const getPushNotificationData = (
  params: Params,
): PushNotificationData => {
  const { orderId, orderStatus, orderNum, unitId } = params;

  return {
    type: PushNotificationTypes.orderStatusUpdate,
    notification: {
      titleLocKey: `order_state_changed`,
      titleLocArgs: JSON.stringify([orderNum || '']),
      bodyLocKey: orderStatus,
    },
    data: {
      orderId,
      orderStatus,
      ...(orderNum && {
        orderNum,
      }),
      unitId,
    },
  };
};
