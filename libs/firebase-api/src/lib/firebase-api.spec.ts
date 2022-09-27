import { FCMPushNotificationService } from './firebase-api';
import { FcmToken, Order, OrderStatus } from '@bgap/domain';
import { of } from 'rxjs';
import { CrudSdk } from '@bgap/data';

xdescribe('firebaseApi integration tests - for manual use only', () => {
  /*
    base64 encode the json after removing line breaks, and set the result as the env variable
    e.g.: cat /file/path/to/firebase/cert.json | tr -d '\n' | base64 | tr -d '\n'
    e.g.: export FIREBASE_SERVICE_ACCOUNT_CERT=`cat /file/path/to/firebase/cert.json | tr -d '\n' | base64 | tr -d '\n'`
   */
  const serviceAccountCertJSONString = Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_CERT || 'READ_COMMENT_ABOVE',
    'base64',
  ).toString();

  describe('Push Notifications integration tests', () => {
    let sdk: CrudSdk;

    beforeEach(() => {
      const fcmTokenOld: FcmToken = {
        token: 'dummy_token_old',
        lastSeen: '2021-09-25T00:00:00.000Z',
      };

      const fcmTokenValid: FcmToken = {
        token: 'dummy_token_valid',
        lastSeen: new Date().toISOString(),
      };

      sdk = {
        GetUser: jest.fn().mockReturnValue(
          of({
            fcmTokens: [fcmTokenOld, fcmTokenValid],
          }),
        ),
      } as unknown as CrudSdk;
    });

    it('should send notification successfully', async () => {
      const pushNotificationService = new FCMPushNotificationService({
        serviceAccountCertJSONString,
        sdk,
      });

      const messageSendResult = await pushNotificationService
        .sendOrderStatusChangePushNotification({
          order: {
            id: 'dummy_order_id',
            orderNum: '123',
            unitId: 'dummy_unit_id',
            currentStatus: OrderStatus.ready,
            userId: 'dummy_user_id',
          } as unknown as Order,
        })
        .toPromise();

      expect(messageSendResult).toMatchSnapshot();
      expect((sdk.GetUser as jest.Mock).mock.calls).toMatchSnapshot();
    }, 10000);
  });
});
