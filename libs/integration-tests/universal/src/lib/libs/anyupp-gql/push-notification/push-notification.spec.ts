import { FCMPushNotificationService } from '@bgap/firebase-api';
import { Order, OrderStatus } from '@bgap/crud-gql/api';
import { tap } from 'rxjs/operators';
import { createIamCrudSdk } from 'libs/integration-tests/universal/src/api-clients';

xdescribe('Test push notification', () => {
  const serviceAccountCertJSONString = Buffer.from(
    process.env.FIREBASE_SERVICE_ACCOUNT_CERT || 'get me from secret store',
    'base64',
  ).toString();

  // Create Order fixture
  const orderFixture: Order = {
    id: 'push-noti-order-4f907792-3d94-11ed-b878-0242ac120002',
    userId: '31ea0871-3dcb-11ed-9ba0-1f6d735e9f41',
    unitId: 'UNTIID',
    createdAt: 'CREATED',
    updatedAt: 'UPDATED',
    items: [],
    statusLog: [],
    sumPriceShown: {
      currency: 'HUF',
      pricePerUnit: 1,
      priceSum: 2,
      tax: 3,
      taxSum: 4,
    },
    archived: false,
    orderNum: '001',
    currentStatus: OrderStatus.served,
  };

  const crudSdk = createIamCrudSdk();

  test('Send push notification', done => {
    const fcm = new FCMPushNotificationService({
      sdk: crudSdk,
      serviceAccountCertJSONString,
    });

    fcm
      .sendOrderStatusChangePushNotification({ order: orderFixture })
      .pipe(tap(res => expect(res).toMatchSnapshot()))
      .subscribe(
        () => done(),
        err => console.error(err),
      );
  });
});
