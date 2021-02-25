import * as config from './config.json';
import * as firebaseConfig from './firebase.config.json';
import { SharedConfig, SharedFirebaseConfig } from './interfaces';

export const isSharedConfig = (): boolean => {
  return (
    (config as SharedConfig).GraphqlApiKey !== undefined &&
    (config as SharedConfig).GraphqlApiUrl !== undefined &&
    (config as SharedConfig).IdentityPoolId !== undefined &&
    (config as SharedConfig).UserPoolClientId !== undefined &&
    (config as SharedConfig).UserPoolDomain !== undefined &&
    (config as SharedConfig).UserPoolId !== undefined &&
    (config as SharedConfig).googleClientId !== undefined &&
    (config as SharedConfig).stripePublishableKey !== undefined
  );
};

export const isSharedFirebaseConfig = (): boolean => {
  return (
    (firebaseConfig as SharedFirebaseConfig).apiKey !== undefined &&
    (firebaseConfig as SharedFirebaseConfig).authDomain !== undefined &&
    (firebaseConfig as SharedFirebaseConfig).databaseURL !== undefined &&
    (firebaseConfig as SharedFirebaseConfig).projectId !== undefined &&
    (firebaseConfig as SharedFirebaseConfig).storageBucket !== undefined &&
    (firebaseConfig as SharedFirebaseConfig).messagingSenderId !== undefined &&
    (firebaseConfig as SharedFirebaseConfig).appId !== undefined &&
    (firebaseConfig as SharedFirebaseConfig).measurementId !== undefined
  );
};
