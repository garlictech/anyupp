import * as firebaseConfig from './lib/firebase.config.json';
import * as config from './lib/config.json';
import * as FIREBASE_SERVICE_ACCOUNT from './lib/firebase-service-account-key.json';

export {
  firebaseConfig as FIREBASE_CONFIG,
  config as CONFIG,
  FIREBASE_SERVICE_ACCOUNT,
};

export * from './lib/interfaces';
