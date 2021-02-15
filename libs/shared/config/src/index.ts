import * as firebaseConfig from './lib/config/firebase.config.json';
import * as config from './lib/config/config.json';
import * as FIREBASE_SERVICE_ACCOUNT from './lib/config/firebase-service-account-key.json';
import { isSharedConfig, isSharedFirebaseConfig } from './lib/interface-checks';

if (!isSharedConfig()) {
  throw new Error('The shared CONFIG is NOT valid');
}

if (!isSharedFirebaseConfig()) {
  throw new Error('The shared FIREBASE_CONFIG is NOT valid');
}

export {
  firebaseConfig as FIREBASE_CONFIG,
  config as CONFIG,
  FIREBASE_SERVICE_ACCOUNT,
};

export * from './lib/shared-secrets.module';
export * from './lib/interfaces';
