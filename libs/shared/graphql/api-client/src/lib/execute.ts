import gql from 'graphql-tag';
import { pluck } from 'rxjs/operators';
import { GraphqlApiClient } from './graphql-api-client';
import { DocumentNode } from 'graphql';

export const toGraphQLDocument = (gqlDocument: string | DocumentNode) =>
  typeof gqlDocument === 'string'
    ? gql`
        ${gqlDocument}
      `
    : gqlDocument;

export const executeQuery = (client: GraphqlApiClient) => <T>(
  gqlDocument: string | DocumentNode,
  variables?: Record<string, unknown>,
) =>
  client
    .query<T>(toGraphQLDocument(gqlDocument), variables)
    .pipe(pluck('data'));

export const executeMutation = (client: GraphqlApiClient) => <T>(
  gqlDocument: string | DocumentNode,
  variables?: Record<string, unknown>,
) =>
  client
    .mutate<T>(toGraphQLDocument(gqlDocument), variables)
    .pipe(pluck('data'));
