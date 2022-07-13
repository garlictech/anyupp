import { PushNotificationTypes } from './PushNotificationTypes';
import {
  DataMessagePayload,
  NotificationMessagePayload,
} from 'firebase-admin/messaging';

export interface PushNotificationData {
  type: PushNotificationTypes;
  notification: NotificationMessagePayload;
  data: DataMessagePayload;
}
