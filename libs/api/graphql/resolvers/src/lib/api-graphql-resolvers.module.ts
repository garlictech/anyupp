import { Module } from '@nestjs/common';
import { StripeResolver } from '../stripe/stripe.resolver';
import { PubSub } from 'graphql-subscriptions';
import * as admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';
import { AdminUserResolver } from '../admin-user/admin-user.resolver';

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
      credential: admin.credential.cert(serviceAccount as any),
      databaseURL: 'https://project-3fa.firebaseio.com/',
    });
  }

}
