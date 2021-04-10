import { ApolloQueryResult, QueryOptions } from 'apollo-client';
import AWSAppSyncClient, { AWSAppSyncClientOptions } from 'aws-appsync/lib';
import { DocumentNode } from 'graphql';
import { from, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import API from '@aws-amplify/api';
import { IAmplifyApiConfig, ILogger } from '@bgap/shared/types';
import { buildRetryLogic } from '@bgap/shared/utils';

export class GraphqlApiClient {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _client: AWSAppSyncClient<any>;
  // See issue #348
  private _graphqlRetryLogic: ReturnType<typeof buildRetryLogic>;
  constructor(
    private genericConfig: IAmplifyApiConfig,
    specificConfig: Partial<AWSAppSyncClientOptions>,
    private logger: ILogger,
  ) {
    API.configure(genericConfig);

    // TODO: the retrayable and retryDelayInMillisec functions is not good
    // for the current GraphQL client responses
    // See issue #348

    // const parser = fp.memoize((error: ApolloError) => {
    //   if (isApolloError(error)) {
    //     // return error.message;
    //     error;
    //   }
    //   // return JSON.stringify(error, undefined, 2);
    //   // return JSON.parse(fp.get('graphQLErrors[0].message', error));
    // });
    // const retryable = (error: unknown) => {
    //   try {
    //     return fp.flow(
    //       // err => parser(err).retryable,
    //       err => !!parser(err).networkError,
    //       retryable => (fp.isBoolean(retryable) ? retryable : true),
    //     )(error);
    //   } catch (_err) {
    //     return true;
    //   }
    // };
    // const retryDelayInMillisec = (error: unknown) => {
    //   try {
    //     return fp.flow(
    //       err => parser(err).retryDelay,
    //       retryable => (fp.isNumber(retryable) ? retryable * 1000 : 2000),
    //     )(error);
    //   } catch (_err) {
    //     return 2000;
    //   }
    // };
    this._graphqlRetryLogic = buildRetryLogic({
      // logger: this.logger,
      // retryable,
      // retryDelayInMillisec,
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
    options?: Partial<QueryOptions> | undefined,
  ): Observable<ApolloQueryResult<T>> {
    // this.logger.debug(
    //   `Query ${JSON.stringify(document)} called with variables ${JSON.stringify(
    //     variables,
    //     null,
    //     2,
    //   )}`,
    // );

    // reconfig
    API.configure(this.genericConfig);
    return from(
      this._client.query({
        query: document,
        variables,
        ...options,
      }),
    ).pipe(
      this._graphqlRetryLogic,
      // pipeDebug('### QUERY AfterRetry'),
      map(x => x as ApolloQueryResult<T>),
    );
  }
  mutate<T = unknown>(
    document: DocumentNode,
    variables?: Record<string, unknown>,
  ): Observable<ApolloQueryResult<T>> {
    // this.logger.debug(
    //   `Mutation ${JSON.stringify(
    //     document,
    //   )} called with variables ${JSON.stringify(variables, null, 2)}`,
    // );
    API.configure(this.genericConfig);
    return from(
      this._client.mutate({
        mutation: document,
        variables,
      }),
    ).pipe(
      this._graphqlRetryLogic,
      // pipeDebug('### MUTATION AfterRetry'),
      map(x => x as ApolloQueryResult<T>),
    );
  }
}
