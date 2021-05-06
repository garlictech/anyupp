import { QueryOptions } from 'apollo-client';
import { DocumentNode } from 'graphql';
import gql from 'graphql-tag';
import { map } from 'rxjs/operators';
import * as fp from 'lodash/fp';

import { GraphqlApiClient } from './graphql-api-client';

export const toGraphQLDocument = (gqlDocument: string | DocumentNode) =>
  typeof gqlDocument === 'string'
    ? gql`
        ${gqlDocument}
      `
    : gqlDocument;

export const executeQuery = <INPUT, OUTPUT>(
  gqlDocument: string | DocumentNode,
  dataPath: string,
  variables?: INPUT,
  queryOptions?: Partial<QueryOptions>,
) => (client: GraphqlApiClient) =>
  client
    .query<INPUT, OUTPUT>(
      toGraphQLDocument(gqlDocument),
      variables,
      queryOptions,
    )
    .pipe(map(fp.get(`data.${dataPath}`)));

export const executeMutation = <INPUT, OUTPUT>(
  gqlDocument: string | DocumentNode,
  dataPath: string,
  variables?: INPUT,
) => (client: GraphqlApiClient) =>
  client
    .mutate<INPUT, OUTPUT>(toGraphQLDocument(gqlDocument), variables)
    .pipe(map(fp.get(`data.${dataPath}`)));

export const executeSubscription = <INPUT, OUTPUT>(
  gqlDocument: string | DocumentNode,
  dataPath: string,
  variables?: INPUT,
) => (client: GraphqlApiClient) =>
  client
    .subscribe<INPUT, OUTPUT>(toGraphQLDocument(gqlDocument), variables)
    .pipe(map(fp.get(`data.${dataPath}`)));
