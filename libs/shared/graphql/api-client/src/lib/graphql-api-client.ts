import { ApolloQueryResult, QueryOptions } from 'apollo-client';
import AWSAppSyncClient, { AWSAppSyncClientOptions } from 'aws-appsync/lib';
import { DocumentNode } from 'graphql';
import { from, Observable } from 'rxjs';
import { FetchResult } from 'apollo-link';
import { CrudApiConfig } from './types';

export class GraphqlApiClient {
  public _client: AWSAppSyncClient<Record<string, never>>;

  constructor(
    genericConfig: CrudApiConfig,
    specificConfig: Partial<AWSAppSyncClientOptions>,
  ) {
    this._client = new AWSAppSyncClient({
      url: genericConfig.aws_appsync_graphqlEndpoint,
      region: genericConfig.aws_appsync_region,
      ...specificConfig,
      cacheOptions: {},
    } as AWSAppSyncClientOptions);
  }

  query<INPUT, OUTPUT>(
    document: DocumentNode,
    variables?: INPUT,
    options?: Partial<QueryOptions>,
  ): Observable<ApolloQueryResult<OUTPUT>> {
    return from(
      this._client.query<OUTPUT>({
        query: document,
        variables,
        ...options,
      }),
    );
  }

  mutate<INPUT, OUTPUT>(
    document: DocumentNode,
    variables?: INPUT,
  ): Observable<FetchResult<OUTPUT>> {
    return from(
      this._client.mutate<OUTPUT>({
        mutation: document,
        variables,
      }),
    );
  }

  subscribe<INPUT, OUTPUT>(
    document: DocumentNode,
    variables?: INPUT,
  ): Observable<OUTPUT> {
    return new Observable(observer => {
      this._client
        .subscribe({
          query: document,
          variables,
        })
        .subscribe({
          next: observer.next,
          error: observer.error,
          complete: observer.complete,
        });
    });
  }
}
