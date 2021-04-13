import { Auth } from 'aws-amplify';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { awsConfig } from '@bgap/admin/amplify-api';
import { config } from '@bgap/shared/config';
import { IAmplifyApiConfig } from '@bgap/shared/types';

import { GraphqlApiClient } from './graphql-api-client';
import { GraphqlApiFp } from './graphql-api-fp';

const AWS_APPSYNC_CONFIG: IAmplifyApiConfig = {
  ...awsConfig,
  aws_appsync_apiKey: config.GraphqlApiKey,
  aws_appsync_graphqlEndpoint: config.GraphqlApiUrl,
};

export const appsyncGraphQlClient = GraphqlApiFp.createPublicClient(
  AWS_APPSYNC_CONFIG,
  console,
  true,
);

export interface AuthenticatdGraphQlClientWithUserId {
  userAttributes: {
    id: string;
    sub: string;
    phone_number: string;
    email: string;
  };
  graphQlClient: GraphqlApiClient;
}

export const configureAmplifyWithUserPasswordAuthFlow = () => {
  Auth.configure({
    ...awsConfig,
    // See: https://github.com/aws-amplify/amplify-js/issues/6552#issuecomment-682259256
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  });
};

export const createAuthenticatedAppsyncGraphQlClient = (
  userName: string,
  password: string,
): Observable<AuthenticatdGraphQlClientWithUserId> => {
  configureAmplifyWithUserPasswordAuthFlow();

  return from(Auth.signIn(userName, password)).pipe(
    map(user => ({
      userAttributes: {
        id: user.attributes.sub,
        ...user.attributes,
      },
      graphQlClient: GraphqlApiFp.createAuthenticatedClient(
        AWS_APPSYNC_CONFIG,
        console,
        true,
      ),
    })),
  );
};

// export const appsyncBackendGraphQlClient = GraphqlApiFp.createBackendClient(
//   AWS_APPSYNC_CONFIG,
//   console,
//   true,
// );

const AWS_AMPLIFY_CONFIG: IAmplifyApiConfig = {
  ...awsConfig,
};

export const amplifyGraphQlClient = GraphqlApiFp.createPublicClient(
  AWS_AMPLIFY_CONFIG,
  console,
  true,
);
