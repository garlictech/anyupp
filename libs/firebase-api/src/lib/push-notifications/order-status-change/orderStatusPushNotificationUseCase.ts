import { getPushNotificationData } from './getPushNotificationData';
import { Order, OrderStatus } from '@bgap/domain';
import { CrudSdk } from '@bgap/crud-gql/api';
import { PushNotificationTypes } from '../PushNotificationTypes';
import { Observable, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';
import { IFCMMessageSendResult } from '../IFCMMessageSendResult';
import { App } from 'firebase-admin/app';
import {
  NotificationMessagePayload,
  DataMessagePayload,
} from 'firebase-admin/messaging';

interface Deps {
  sdk: CrudSdk;
  fbAdminApp: App;
  order: Order;
  getFCMTokenFn: (params: {
    sdk: CrudSdk;
    id: string;
  }) => Observable<string | null>;
  sendPushFn: (params: {
    fbAdminApp: App;
    fcmToken: string;
    type: PushNotificationTypes;
    notification: NotificationMessagePayload;
    data: DataMessagePayload;
  }) => Observable<IFCMMessageSendResult>;
}

export const orderStatusPushNotificationUseCase = (
  deps: Deps,
): Observable<IFCMMessageSendResult> => {
  const { sdk, fbAdminApp, order, getFCMTokenFn, sendPushFn } = deps;
  const orderStatus = order.currentStatus || OrderStatus.none;

  return getFCMTokenFn({
    id: order.userId,
    sdk,
  }).pipe(
    tap(fcmToken =>
      fcmToken
        ? console.debug('FCMToken found')
        : console.debug(`No valid FCMToken for user: ${order.userId}`),
    ),
    switchMap(fcmToken =>
      fcmToken
        ? sendPushFn({
            fbAdminApp,
            fcmToken,
            ...getPushNotificationData({
              orderStatus,
              orderId: order.id,
              orderNum: order.orderNum,
              unitId: order.unitId,
            }),
          })
        : of({
            successCount: 0,
            failureCount: 0,
          }),
    ),
  );
};
