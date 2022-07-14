import { PushNotificationTypes } from './PushNotificationTypes';
import fbAdmin from 'firebase-admin';

export interface PushNotificationData {
  type: PushNotificationTypes;
  notification: fbAdmin.messaging.NotificationMessagePayload;
  data: fbAdmin.messaging.DataMessagePayload;
}
