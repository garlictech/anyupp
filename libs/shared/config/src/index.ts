import * as FIREBASE_CONFIG from './lib/firebase.config.json';
import * as FIREBASE_SERVICE_ACCOUNT from './lib/firebase-service-account-key.json';
import * as CONFIG from './lib/config.json';

export { FIREBASE_CONFIG, CONFIG, FIREBASE_SERVICE_ACCOUNT };

// TODO: remove TEMPORARY solution
import stripe from './lib/config/stripe.config.json';
export { stripe as STRIPE_CONFIG };
