import { awsConfig } from '@bgap/crud-gql/api';
import { config } from '@bgap/shared/config';
import { ICrudApiConfig } from '@bgap/shared/types';
import { GraphqlApiFp } from './graphql-api-fp';
import { Auth } from 'aws-amplify';
import { GraphqlApiClient } from './graphql-api-client';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';

const AWS_APPSYNC_CONFIG: ICrudApiConfig = {
  ...awsConfig,
  aws_appsync_apiKey: config.AnyuppGraphqlApiKey,
  aws_appsync_graphqlEndpoint: config.AnyuppGraphqlApiUrl,
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

const AWS_AMPLIFY_CONFIG: ICrudApiConfig = {
  ...awsConfig,
};

export const amplifyGraphQlClient = GraphqlApiFp.createPublicClient(
  AWS_AMPLIFY_CONFIG,
  console,
  true,
);

export const amplifyBackendGraphQlClient = GraphqlApiFp.createBackendClient(
  AWS_AMPLIFY_CONFIG,
  process.env.AWS_ACCESS_KEY_ID || '',
  process.env.AWS_SECRET_ACCESS_KEY || '',
  console,
);

export const createAuthenticatedAmplifyGraphQlClient = (
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
        AWS_AMPLIFY_CONFIG,
        console,
        true,
      ),
    })),
  );
};
