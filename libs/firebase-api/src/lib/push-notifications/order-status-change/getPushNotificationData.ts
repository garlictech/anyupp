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
      titleLocKey: `NOTIFICATION_TITLE_ORDER_STATUS_UPDATE_${orderStatus.toUpperCase()}`,
      titleLocArgs: JSON.stringify([orderNum || '']),
      bodyLocKey: `NOTIFICATION_BODY_ORDER_STATUS_UPDATE_${orderStatus.toUpperCase()}`,
      bodyLocArgs: JSON.stringify([orderNum || '']),
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
