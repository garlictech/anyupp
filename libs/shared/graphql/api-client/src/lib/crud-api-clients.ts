import { awsConfig } from '@bgap/crud-gql/api';
import { ICrudApiConfig } from '@bgap/shared/types';
import { Auth } from 'aws-amplify';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { configureAmplifyWithUserPasswordAuthFlow } from './anyupp-api-clients';
import { GraphqlApiFp } from './graphql-api-fp';
import { AuthenticatdGraphQLClientWithUserId } from './common';

// ############
// ### CRUD ###
export const AWS_CRUD_CONFIG: ICrudApiConfig = {
  ...awsConfig,
};

export const crudGraphqlClient = GraphqlApiFp.createPublicClient(
  AWS_CRUD_CONFIG,
  console,
  true,
);

export const crudAuthenticatedGraphqlClient = GraphqlApiFp.createAuthenticatedClient(
  AWS_CRUD_CONFIG,
  console,
  true,
);

export const crudBackendGraphQLClient = GraphqlApiFp.createBackendClient(
  AWS_CRUD_CONFIG,
  'AKIAYIT7GMY5RXSLLQN3', // TODO: process.env.AWS_ACCESS_KEY_ID || '',
  'aYxNIqJ7O56ltpHb1Aq534bpv2r+Atpr1TUxiahx', // TODO: process.env.AWS_SECRET_ACCESS_KEY || '',
  console,
);

export const createAuthenticatedCrudGraphQLClient = (
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
      graphQlClient: crudAuthenticatedGraphqlClient,
    })),
  );
};
