export interface SharedConfig {
  AnyuppGraphqlApiKey: string;
  AnyuppGraphqlApiUrl: string;
  IdentityPoolId: string;
  UserPoolClientId: string;
  UserPoolDomain: string;
  UserPoolId: string;
  // googleClientId: string;
  // stripePublishableKey: string;
  AnyuppGraphqlApiKeyAmplify: string;
  AnyuppGraphqlApiUrlAmplify: string;
}

export interface SharedFirebaseConfig {
  apiKey: string;
  authDomain: string;
  databaseURL: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
  measurementId: string;
}
