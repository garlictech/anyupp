import { Auth } from 'aws-amplify';

import { awsConfig } from '@bgap/crud-gql/api';
import {
  getCognitoUsername,
  testAdminUserPassword,
} from '@bgap/shared/fixtures';

export const signInToCognito = async () => {
  Auth.configure({
    ...awsConfig,
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  });

  await Auth.signIn(getCognitoUsername('monad'), testAdminUserPassword);
};

export const signOutFromCognito = async () => {
  await Auth.signOut();
};
