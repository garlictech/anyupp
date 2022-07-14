import fbAdmin from 'firebase-admin';
import { from, Observable, of } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { handleMessageResponse } from './handleMessageResponse';
import { PushNotificationData } from './PushNotificationData';
import { IFCMMessageSendResult } from './IFCMMessageSendResult';

interface Params extends PushNotificationData {
  fbAdminApp: fbAdmin.app.App;
  fcmToken: string;
}

export const sendPushNotificationToDevice = (
  params: Params,
): Observable<IFCMMessageSendResult> => {
  const { fbAdminApp, type, fcmToken, notification, data } = params;
  const fcm: fbAdmin.messaging.Messaging = fbAdmin.messaging(fbAdminApp);

  console.debug(`sendPushNotificationToDevice called with token: ${fcmToken}`);

  return from(
    fcm.sendToDevice(
      fcmToken,
      {
        notification,
        data: {
          type,
          ...data,
        },
      },
      {
        priority: 'high',
      },
    ),
  ).pipe(
    switchMap(mdResponse =>
      from(handleMessageResponse({ fcmToken, mdResponse })),
    ),
    catchError(error => {
      console.error('Error in sendPushNotificationToDevice:', error);

      return of({
        successCount: 0,
        failureCount: 0,
      });
    }),
  );
};
