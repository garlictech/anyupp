import * as FIREBASE_CONFIG from './lib/config/firebase.config.json';
import * as FIREBASE_SERVICE_ACCOUNT from './lib/config/firebase-service-account-key.json';
import * as CONFIG from './lib/config/config.json';

export { FIREBASE_CONFIG, CONFIG, FIREBASE_SERVICE_ACCOUNT };

export * from './lib/shared-secrets.module';

export interface SharedSecrets {
  stripeSecretKey: string;
  googleClientSecret: string;
}
