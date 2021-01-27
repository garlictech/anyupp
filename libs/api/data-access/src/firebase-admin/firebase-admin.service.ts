import { Injectable } from '@nestjs/common';
import * as fbAdmin from 'firebase-admin';

import { FIREBASE_SERVICE_ACCOUNT, FIREBASE_CONFIG } from '@bgap/shared/config';

export type AdminApp = fbAdmin.app.App;

@Injectable()
export class FirebaseAdminService {
  public admin: AdminApp;

  constructor() {
    this.admin = fbAdmin.initializeApp({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      credential: fbAdmin.credential.cert(<any>FIREBASE_SERVICE_ACCOUNT),
      databaseURL: FIREBASE_CONFIG.databaseURL,
    });
  }
}
