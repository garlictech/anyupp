import {
  AnyuppSdk,
  getAnyuppSdkForIAM,
  getAnyuppSdkForUserPool,
} from '@bgap/anyupp-gql/api';
import {
  awsConfig,
  getCrudSdkForIAM,
  getCrudSdkForUserPool,
} from '@bgap/crud-gql/api';
import { Auth } from 'aws-amplify';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface AuthenticatdGraphQLClientWithUserId {
  userAttributes: {
    id: string;
    email: string;
    // ???
  };
  authAnyuppSdk: AnyuppSdk;
}

const authConfig = () =>
  Auth.configure({
    ...awsConfig,
    // See: https://github.com/aws-amplify/amplify-js/issues/6552#issuecomment-682259256
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  });

export const createAuthenticatedCrudSdk = (
  userName: string,
  password: string,
) => {
  authConfig();
  return from(Auth.signIn(userName, password)).pipe(map(getCrudSdkForUserPool));
};

export const createAuthenticatedAnyuppSdk = (
  userName: string,
  password: string,
): Observable<AuthenticatdGraphQLClientWithUserId> => {
  authConfig();
  return from(Auth.signIn(userName, password)).pipe(
    map(user => ({
      userAttributes: {
        id: user.signInUserSession?.idToken?.payload?.['cognito:username'], // The Username is the new userId
        ...user.attributes,
      },
      authAnyuppSdk: getAnyuppSdkForUserPool(),
    })),
  );
};

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
