import { Module } from '@nestjs/common';
import { HelloResolver } from '../hello/hello.resolver';
import * as admin from 'firebase-admin';
import serviceAccount from './serviceAccountKey.json';
import { AdminUserResolver } from '../admin-user/admin-user.resolver';
import { PubSub } from 'graphql-subscriptions';

@Module({
  controllers: [],
  providers: [
    HelloResolver,
    AdminUserResolver,
    {
      provide: 'PUB_SUB',
      useValue: new PubSub(),
    },
  ],
  exports: [],
})
export class GraphqlResolversModule {
  constructor() {
    admin.initializeApp({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      credential: admin.credential.cert(serviceAccount as any),
      databaseURL: 'https://project-3fa.firebaseio.com/',
    });
  }
}
