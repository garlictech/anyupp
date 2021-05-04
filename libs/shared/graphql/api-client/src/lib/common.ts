import { GraphqlApiClient } from './graphql-api-client';

export interface AuthenticatdGraphQLClientWithUserId {
  userAttributes: {
    id: string;
    sub: string;
    phone_number: string;
    email: string;
  };
  graphQlClient: GraphqlApiClient;
}
