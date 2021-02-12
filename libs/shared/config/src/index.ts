import * as firebaseConfig from './lib/config/firebase.config.json';
import * as config from './lib/config/config.json';
import * as FIREBASE_SERVICE_ACCOUNT from './lib/config/firebase-service-account-key.json';
import { SharedConfig, SharedFirebaseConfig } from './lib/interfaces';

const fbConf: SharedFirebaseConfig = firebaseConfig;
const conf: SharedConfig = config;
export { fbConf as FIREBASE_CONFIG, conf as CONFIG, FIREBASE_SERVICE_ACCOUNT };

export * from './lib/shared-secrets.module';
export * from './lib/interfaces';
