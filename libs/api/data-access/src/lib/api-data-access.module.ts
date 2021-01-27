import { Module } from '@nestjs/common';
import * as admin from 'firebase-admin';
import { FIREBASE_CONFIG, FIREBASE_SERVICE_ACCOUNT } from '@bgap/shared/config';

@Module({
  controllers: [],
  providers: [],
  exports: [],
})
export class ApiDataAccessModule {
  constructor() {
    admin.initializeApp({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      credential: admin.credential.cert(<any>FIREBASE_SERVICE_ACCOUNT),
      databaseURL: FIREBASE_CONFIG.databaseURL,
    });
  }
}
