import * as fp from 'lodash/fp';
import { from, Observable, ObservableInput, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { API, GRAPHQL_AUTH_MODE, GraphQLResult } from '@aws-amplify/api';
import Amplify from '@aws-amplify/core';
import {
  CrudApiMutationDocuments as Mutations,
  CrudApiQueryDocuments as Queries,
  CrudApiSubscriptionDocuments as Subscriptions,
  awsConfig,
} from '@bgap/crud-gql/api';
import { IAmplifyModel } from '@bgap/shared/types';

import {
  apiQueryTypes,
  listTypes,
  queryTypes,
  subscriptionTypes,
} from './types';

interface ISubscriptionResult {
  value?: {
    data: subscriptionTypes;
  };
}

interface ISubscriptionParams {
  subscriptionName: keyof typeof AmplifyApiSubscriptionDocuments;
  resetFn?: () => void;
  upsertFn: (data: unknown) => void;
  variables?: Record<string, unknown>;
}

interface IQueryParams {
  queryName: keyof typeof AmplifyApiQueryDocuments;
  variables?: Record<string, unknown>;
}

interface ISnapshotParams extends ISubscriptionParams, IQueryParams {}

@Injectable({
  providedIn: 'root',
})
export class AmplifyDataService {
  public snapshotChanges$(params: ISnapshotParams): Observable<unknown> {
    Amplify.configure(awsConfig);

    return from(
      <Promise<GraphQLResult<apiQueryTypes>>>API.graphql({
        query: AmplifyApiQueryDocuments[params.queryName] as string,
        variables: params.variables,
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      }),
    ).pipe(
      take(1),
      tap(data => {
        if (params.resetFn) {
          params.resetFn();
        }

        if (data.data?.[<keyof listTypes>params.queryName]?.items) {
          (data.data?.[<keyof listTypes>params.queryName]?.items || []).forEach(
            (d: unknown) => {
              params.upsertFn(d);
            },
          );
        } else if (data?.data?.[<keyof queryTypes>params.queryName]) {
          params.upsertFn(data?.data?.[<keyof queryTypes>params.queryName]);
        }
      }),
      switchMap(
        () => <ObservableInput<ISubscriptionResult>>API.graphql({
            query: AmplifyApiSubscriptionDocuments[params.subscriptionName],
            variables: params.variables,
            //  authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
          }),
      ),
      tap((data: ISubscriptionResult) => {
        params.upsertFn(
          data?.value?.data?.[<keyof subscriptionTypes>params.subscriptionName],
        );
      }),
    );
  }

  public async create(
    mutationName: keyof typeof AmplifyApiMutationDocuments,
    value: unknown,
  ) {
    Amplify.configure(awsConfig);

    return API.graphql({
      query: AmplifyApiMutationDocuments[mutationName],
      variables: { input: value },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });
  }

  public async update<T>(
    queryName: keyof typeof AmplifyApiQueryDocuments,
    mutationName: keyof typeof AmplifyApiMutationDocuments,
    id: string,
    updaterFn: (data: unknown) => T,
  ) {
    Amplify.configure(awsConfig);

    const data: GraphQLResult<queryTypes> = await (<
      Promise<GraphQLResult<queryTypes>>
    >API.graphql({
      query: AmplifyApiQueryDocuments[<keyof queryTypes>queryName],
      variables: { id },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    }));

    const modified = fp.omit(['createdAt', 'updatedAt'], <IAmplifyModel>{
      ...updaterFn(data?.data?.[<keyof queryTypes>queryName]),
      id,
    });

    return API.graphql({
      query: AmplifyApiMutationDocuments[mutationName],
      variables: { input: modified },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });
  }

  public async delete(
    mutationName: keyof typeof AmplifyApiMutationDocuments,
    value: unknown,
  ) {
    Amplify.configure(awsConfig);

    return API.graphql({
      query: AmplifyApiMutationDocuments[mutationName],
      variables: { input: value },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });
  }

  public query(params: IQueryParams) {
    Amplify.configure(awsConfig);

    return <Promise<GraphQLResult<apiQueryTypes>>>API.graphql({
      query: AmplifyApiQueryDocuments[params.queryName] as string,
      variables: params.variables,
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });
  }

  public subscribe$(params: ISubscriptionParams): Observable<unknown> {
    Amplify.configure(awsConfig);

    return of('subscription').pipe(
      switchMap(
        () => <ObservableInput<ISubscriptionResult>>API.graphql({
            query: AmplifyApiSubscriptionDocuments[params.subscriptionName],
            variables: params.variables,
            // authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS
          }),
      ),
      tap((data: ISubscriptionResult) => {
        params.upsertFn(
          data?.value?.data?.[<keyof subscriptionTypes>params.subscriptionName],
        );
      }),
    );
  }
}
