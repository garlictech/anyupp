import gql from 'graphql-tag';
import { pluck } from 'rxjs/operators';
import { GraphqlApiClient } from './graphql-api-client';

export const toGraphQLDocument = (documentString: string) =>
  gql`
    ${documentString}
  `;

export const executeQuery = (client: GraphqlApiClient) => <T>(
  gqlDocumentString: string,
  variables?: Record<string, unknown>,
) =>
  client
    .query<T>(toGraphQLDocument(gqlDocumentString), variables)
    .pipe(pluck('data'));

export const executeMutation = (client: GraphqlApiClient) => <T>(
  gqlDocumentString: string,
  variables?: Record<string, unknown>,
) =>
  client
    .mutate<T>(toGraphQLDocument(gqlDocumentString), variables)
    .pipe(pluck('data'));
