import { awsConfig } from '@bgap/crud-gql/api';
import { config } from '@bgap/shared/config';
import { ICrudApiConfig } from '@bgap/shared/types';
import { GraphqlApiFp } from './graphql-api-fp';
import { Auth } from 'aws-amplify';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthenticatdGraphQLClientWithUserId } from './common';

// #############
// ### AYUPP ###

export const AWS_ANYUPP_CONFIG: ICrudApiConfig = {
  ...awsConfig,
  aws_appsync_apiKey: config.AnyuppGraphqlApiKey,
  aws_appsync_graphqlEndpoint: config.AnyuppGraphqlApiUrl,
};

export const anyuppGraphQLClient = GraphqlApiFp.createPublicClient(
  AWS_ANYUPP_CONFIG,
  console,
  true,
);

export const configureAmplifyWithUserPasswordAuthFlow = () => {
  Auth.configure({
    ...awsConfig,
    // See: https://github.com/aws-amplify/amplify-js/issues/6552#issuecomment-682259256
    authenticationFlowType: 'USER_PASSWORD_AUTH',
    aws_appsync_authenticationType: 'AMAZON_COGNITO_USER_POOLS',
  });
};

export const createAuthenticatedAnyuppGraphQLClient = (
  userName: string,
  password: string,
): Observable<AuthenticatdGraphQLClientWithUserId> => {
  configureAmplifyWithUserPasswordAuthFlow();

  return from(Auth.signIn(userName, password)).pipe(
    map(user => ({
      userAttributes: {
        id: user.attributes.sub,
        ...user.attributes,
      },
      graphQlClient: GraphqlApiFp.createAuthenticatedClient(
        AWS_ANYUPP_CONFIG,
        console,
        true,
      ),
    })),
  );
};
