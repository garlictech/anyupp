/*import { awsConfig } from '@bgap/crud-gql/api';
import { Auth } from 'aws-amplify';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { configureAmplifyWithUserPasswordAuthFlow } from './anyupp-api-clients';
import { GraphqlApiFp } from './graphql-api-fp';
import { AuthenticatdGraphQLClientWithUserId } from './common';
*/
// ############
// ### CRUD ###
//export const AWS_CRUD_CONFIG: ICrudApiConfig = {
/*export const AWS_CRUD_CONFIG: any = {
  ...awsConfig,
};

export const crudGraphqlClient = GraphqlApiFp.createPublicClient(
  AWS_CRUD_CONFIG,
  true,
);

export const crudAuthenticatedGraphqlClient = GraphqlApiFp.createAuthenticatedClient(
  AWS_CRUD_CONFIG,
  true,
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
*/
