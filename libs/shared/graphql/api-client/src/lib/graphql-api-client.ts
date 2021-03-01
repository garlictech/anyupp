import { ApolloQueryResult } from 'apollo-client';
import AWSAppSyncClient, { AWSAppSyncClientOptions } from 'aws-appsync/lib';
import { DocumentNode } from 'graphql';
import * as fp from 'lodash/fp';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import API from '@aws-amplify/api';
import { IAmplifyApiConfig, ILogger } from '@bgap/shared/types';
import { buildRetryLogic } from '@bgap/shared/utils';

export class GraphqlApiClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _client: AWSAppSyncClient<any>;
  private _graphqlRetryLogic: ReturnType<typeof buildRetryLogic>;
  constructor(
    genericConfig: IAmplifyApiConfig,
    specificConfig: Partial<AWSAppSyncClientOptions>,
    private logger: ILogger,
  ) {
    API.configure(genericConfig);

    const parser = fp.memoize((error: unknown) =>
      JSON.parse(fp.get('graphQLErrors[0].message', error)),
    );
    const retryable = (error: unknown) => {
      try {
        return fp.flow(
          err => parser(err).retryable,
          retryable => (fp.isBoolean(retryable) ? retryable : true),
        )(error);
      } catch (_err) {
        return true;
      }
    };
    const retryDelayInMillisec = (error: unknown) => {
      try {
        return fp.flow(
          err => parser(err).retryDelay,
          retryable => (fp.isNumber(retryable) ? retryable * 1000 : 2000),
        )(error);
      } catch (_err) {
        return 2000;
      }
    };
    this._graphqlRetryLogic = buildRetryLogic({
      logger: this.logger,
      retryable,
      retryDelayInMillisec,
    });
    this._client = new AWSAppSyncClient({
      url: genericConfig.aws_appsync_graphqlEndpoint,
      region: genericConfig.aws_appsync_region,
      ...specificConfig,
    } as AWSAppSyncClientOptions);
  }
  query<T = unknown>(
    document: DocumentNode,
    variables?: Record<string, unknown>,
  ): Observable<ApolloQueryResult<T>> {
    this.logger.debug(
      `Query ${JSON.stringify(document)} called with variables ${JSON.stringify(
        variables,
        null,
        2,
      )}`,
    );
    return from(
      this._client.query({
        query: document,
        variables,
      }),
    ).pipe(
      this._graphqlRetryLogic,
      map(x => x as ApolloQueryResult<T>),
    );
  }
  mutate(
    document: DocumentNode,
    variables?: Record<string, unknown>,
  ): Observable<unknown> {
    return from(
      this._client.mutate({
        mutation: document,
        variables,
      }),
    ).pipe(this._graphqlRetryLogic);
  }
}
