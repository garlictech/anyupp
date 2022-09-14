import { PushNotificationTypes } from './PushNotificationTypes';
import {
  NotificationMessagePayload,
  DataMessagePayload,
} from 'firebase-admin/messaging';
export interface PushNotificationData {
  type: PushNotificationTypes;
  notification: NotificationMessagePayload;
  data: DataMessagePayload;
}
