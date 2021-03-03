import * as firebaseConfig from './lib/firebase.config.json';
import * as config from './lib/config/config.dev-petrot.json';
import * as FIREBASE_SERVICE_ACCOUNT from './lib/firebase-service-account-key.json';
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

export * from './lib/interfaces';
