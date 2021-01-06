import { Module } from '@nestjs/common';
import { HelloResolver } from '../hello/hello.resolver';
import { GetAdminUserResolver } from '../get-admin-user/get-admin-user.resolver';
import * as admin from 'firebase-admin';

const serviceAccount = require('./serviceAccountKey.json');

@Module({
  controllers: [],
  providers: [HelloResolver, GetAdminUserResolver],
  exports: [],
})
export class GraphqlResolversModule {
  constructor() {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: 'https://project-3fa.firebaseio.com/',
    });
  }
}
