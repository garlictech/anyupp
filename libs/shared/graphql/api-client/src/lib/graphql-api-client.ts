import { ApolloQueryResult, QueryOptions } from 'apollo-client';
import AWSAppSyncClient, {
  AWSAppSyncClientOptions,
  createAppSyncLink,
} from 'aws-appsync/lib';
import { createHttpLink } from 'apollo-link-http';
import { setContext } from 'apollo-link-context';
import { ApolloLink, FetchResult } from 'apollo-link';
import { DocumentNode } from 'graphql';
import { from, Observable } from 'rxjs';
import { CrudApiConfig } from './types';

const CUSTOM_USER_AGENT = 'GraphqlApiClient';

export class GraphqlApiClient {
  public _client: AWSAppSyncClient<Record<string, never>>;

  constructor(
    genericConfig: CrudApiConfig,
    specificConfig: Partial<AWSAppSyncClientOptions>,
  ) {
    const AppSyncConfig = {
      url: genericConfig.aws_appsync_graphqlEndpoint,
      region: genericConfig.aws_appsync_region,
      ...specificConfig,
      cacheOptions: {},
      customUserAgent: 'my-process-name',
    } as AWSAppSyncClientOptions;

    this._client = new AWSAppSyncClient(AppSyncConfig, {
      link: createAppSyncLink({
        ...AppSyncConfig,
        resultsFetcherLink: ApolloLink.from([
          setContext((request, previousContext) => ({
            headers: {
              ...previousContext.headers,
              'user-agent': CUSTOM_USER_AGENT,
            },
          })),
          createHttpLink({
            uri: AppSyncConfig.url,
          }),
        ]),
        complexObjectsCredentials: () => null,
      }),
    });
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
