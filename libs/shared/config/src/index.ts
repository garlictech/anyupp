import * as firebaseConfig from './lib/firebase.config.json';
import * as config from './lib/config.json';
import * as devConfig from './lib/dev/config.json';
import * as qaConfig from './lib/qa/config.json';
import * as FIREBASE_SERVICE_ACCOUNT from './lib/firebase-service-account-key.json';

export {
  firebaseConfig as FIREBASE_CONFIG,
  config as CONFIG,
  FIREBASE_SERVICE_ACCOUNT,
};

export * from './lib/interfaces';
export { devConfig, qaConfig };
