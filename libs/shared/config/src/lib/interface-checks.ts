import { SharedConfig, SharedFirebaseConfig } from './interfaces';

export const isSharedConfig = (config: SharedConfig): boolean => {
  return (
    config.GraphqlApiKey !== undefined &&
    config.GraphqlApiUrl !== undefined &&
    config.GraphqlApiKeyAmplify !== undefined &&
    config.GraphqlApiUrlAmplify !== undefined &&
    config.IdentityPoolId !== undefined &&
    config.UserPoolClientId !== undefined &&
    config.UserPoolDomain !== undefined &&
    config.UserPoolId !== undefined
    // (config as SharedConfig).googleClientId !== undefined &&
    // (config as SharedConfig).stripePublishableKey !== undefined
  );
};

export const isSharedFirebaseConfig = (
  config: SharedFirebaseConfig,
): boolean => {
  return (
    config.apiKey !== undefined &&
    config.authDomain !== undefined &&
    config.databaseURL !== undefined &&
    config.projectId !== undefined &&
    config.storageBucket !== undefined &&
    config.messagingSenderId !== undefined &&
    config.appId !== undefined &&
    config.measurementId !== undefined
  );
};
