import {
  awsConfig,
  getCrudSdkForIAM,
  getCrudSdkForUserPool,
} from '@bgap/crud-gql/api';
import { Auth } from 'aws-amplify';
import { from, Observable } from 'rxjs';
import { map, mapTo } from 'rxjs/operators';

export const createAuthenticatedCrudSdk = (
  userName: string,
  password: string,
) => {
  Auth.configure({
    ...awsConfig,
    // See: https://github.com/aws-amplify/amplify-js/issues/6552#issuecomment-682259256
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  });

  return from(Auth.signIn(userName, password)).pipe(map(getCrudSdkForUserPool));
};

export const createIamSdk = () =>
  getCrudSdkForIAM(
    process.env.AWS_ACCESS_KEY_ID || '',
    process.env.AWS_SECRET_ACCESS_KEY || '',
  );
