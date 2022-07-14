import fbAdmin from 'firebase-admin';
import { Order } from '@bgap/domain';
import { CrudSdk } from '@bgap/crud-gql/api';
import { orderStatusPushNotificationUseCase } from './order-status-change';
import { getFCMTokenForUser } from './getFCMTokenForUser';
import { sendPushNotificationToDevice } from './sendPushNotificationToDevice';
import { IFCMPushNotificationService } from './IFCMPushNotificationService';
import { Observable } from 'rxjs';
import { IFCMMessageSendResult } from './IFCMMessageSendResult';

interface ConstructorParams {
  sdk: CrudSdk;
  serviceAccountCertJSONString: string;
}

export class FCMPushNotificationService implements IFCMPushNotificationService {
  private readonly sdk: CrudSdk;
  private readonly fbAdminApp: fbAdmin.app.App;

  constructor({ sdk, serviceAccountCertJSONString }: ConstructorParams) {
    this.sdk = sdk;
    this.fbAdminApp = fbAdmin.initializeApp({
      credential: fbAdmin.credential.cert(
        JSON.parse(serviceAccountCertJSONString),
      ),
    });
  }

  public sendOrderStatusChangePushNotification = ({
    order,
  }: {
    order: Order;
  }): Observable<IFCMMessageSendResult> => {
    return orderStatusPushNotificationUseCase({
      sdk: this.sdk,
      fbAdminApp: this.fbAdminApp,
      order,
      getFCMTokenFn: getFCMTokenForUser,
      sendPushFn: sendPushNotificationToDevice,
    });
  };
}
