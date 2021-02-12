export interface SharedSecrets {
  stripeSecretKey: string;
  googleClientSecret: string;
}

export interface SharedConfig {
  GraphqlApiKey: string;
  GraphqlApiUrl: string;
  IdentityPoolId: string;
  UserPoolClientId: string;
  UserPoolDomain: string;
  UserPoolId: string;
  googleClientId: string;
  stripePublishableKey: string;
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
