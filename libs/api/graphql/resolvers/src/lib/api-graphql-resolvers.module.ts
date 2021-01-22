import { Module } from '@nestjs/common';
import { StripeResolver } from '../stripe/stripe.resolver';
import { PubSub } from 'graphql-subscriptions';
import * as admin from 'firebase-admin';
import { AdminUserResolver } from '../admin-user/admin-user.resolver';
import { FIREBASE_CONFIG, FIREBASE_SERVICE_ACCOUNT } from '@bgap/shared/config';

@Module({
  controllers: [],
  providers: [
    StripeResolver,
    AdminUserResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [],
})
export class ApiGraphqlResolversModule {
  constructor() {
    admin.initializeApp({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      credential: admin.credential.cert(<any>FIREBASE_SERVICE_ACCOUNT),
      databaseURL: FIREBASE_CONFIG.databaseURL,
    });
  }
}
