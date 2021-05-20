import {
  awsConfig,
  getCrudSdkForIAM,
  getCrudSdkForUserPool,
} from '@bgap/crud-gql/api';
import {
  getAnyuppSdkForIAM,
  getAnyuppSdkForUserPool,
} from '@bgap/anyupp-gql/api';
import { Auth } from 'aws-amplify';
import { from } from 'rxjs';
import { map } from 'rxjs/operators';

Auth.configure({
  ...awsConfig,
  // See: https://github.com/aws-amplify/amplify-js/issues/6552#issuecomment-682259256
  authenticationFlowType: 'USER_PASSWORD_AUTH',
  aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
});

export const createAuthenticatedCrudSdk = (
  userName: string,
  password: string,
) => from(Auth.signIn(userName, password)).pipe(map(getCrudSdkForUserPool));

export const createAuthenticatedAnyuppSdk = (
  userName: string,
  password: string,
) => from(Auth.signIn(userName, password)).pipe(map(getAnyuppSdkForUserPool));

export const createIamCrudSdk = () =>
  getCrudSdkForIAM(
    process.env.AWS_ACCESS_KEY_ID || '',
    process.env.AWS_SECRET_ACCESS_KEY || '',
  );

export const createIamAnyuppSdk = () =>
  getAnyuppSdkForIAM(
    process.env.AWS_ACCESS_KEY_ID || '',
    process.env.AWS_SECRET_ACCESS_KEY || '',
  );
