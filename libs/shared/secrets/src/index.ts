import { getSecrets } from './lib/get-secrets';
export * from './lib/interfaces';
export * from './lib/get-secrets';

export const sharedSecretsPromise = getSecrets();
