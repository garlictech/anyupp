import { Order } from '@bgap/domain';
import { Observable } from 'rxjs';
import { IFCMMessageSendResult } from './IFCMMessageSendResult';

export interface IFCMPushNotificationService {
  sendOrderStatusChangePushNotification(params: {
    order: Order;
  }): Observable<IFCMMessageSendResult>;
}
