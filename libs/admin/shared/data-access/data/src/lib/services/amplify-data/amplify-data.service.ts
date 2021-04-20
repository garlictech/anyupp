import * as fp from 'lodash/fp';
import { from, Observable, ObservableInput, of } from 'rxjs';
import { delay, switchMap, take, tap } from 'rxjs/operators';
import {
  anyuppAuthenticatedGraphqlClient,
  GraphqlApiFp,
} from '@bgap/shared/graphql/api-client';
import { Injectable } from '@angular/core';
import {
  API,
  GRAPHQL_AUTH_MODE,
  GraphQLResult,
  graphqlOperation,
} from '@aws-amplify/api';
import Amplify from '@aws-amplify/core';
import * as AnyuppApi from '@bgap/anyupp-gql/api';
import {
  CrudApiMutationDocuments,
  CrudApiQueryDocuments,
  CrudApiSubscriptionDocuments,
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
  subscriptionName: keyof typeof CrudApiSubscriptionDocuments;
  resetFn?: () => void;
  upsertFn: (data: unknown) => void;
  variables?: Record<string, unknown>;
}

interface IQueryParams {
  queryName: keyof typeof CrudApiQueryDocuments;
  variables?: Record<string, unknown>;
}

interface ISnapshotParams extends ISubscriptionParams, IQueryParams {}

@Injectable({
  providedIn: 'root',
})
export class AmplifyDataService {
  public snapshotChanges$(params: ISnapshotParams): Observable<unknown> {
   // Amplify.configure(awsConfig);
    /*
    <ObservableInput<ISubscriptionResult>>API.graphql({
      //return of(API.graphql({
       query: CrudApiSubscriptionDocuments[params.subscriptionName],
       variables: params.variables,
     }).subscribe(data => {
       console.error('data?', data);
     })
*/
    // Subscribe to creation of Todo
    /*
const subscription = (<any>API.graphql(
  graphqlOperation(CrudApiSubscriptionDocuments.onAdminUserChange, params.variables)
)).subscribe({
  next: ({ provider, value }) => console.log({ provider, value }),
  error: error => console.warn(error)
});*/

    /*return from(
      <Promise<GraphQLResult<apiQueryTypes>>>API.graphql({
        query: CrudApiQueryDocuments[params.queryName] as string,
        variables: params.variables,
        authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
      }),
    ).pipe(
      tap(() => console.error(`Q ${params.queryName} fired`)),
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
      }),*/
    return of('subscriber').pipe(
      switchMap(() => {
        console.error('PARAMS?', params);
        return <ObservableInput<ISubscriptionResult>>API.graphql({
          //return of(API.graphql({
          query: CrudApiSubscriptionDocuments[params.subscriptionName],
          variables: params.variables,
        });
      }),
      tap((data: any) => {
        console.error(`S ${params.subscriptionName} fired`, data);
        params.upsertFn(
          data?.value?.data?.[<keyof subscriptionTypes>params.subscriptionName],
        );
      }),
      tap(() => console.error('steam vééége 1')),
    );
  }

  public async create(
    mutationName: keyof typeof CrudApiMutationDocuments,
    value: unknown,
  ) {
    Amplify.configure(awsConfig);

    return API.graphql({
      query: CrudApiMutationDocuments[mutationName],
      variables: { input: value },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });
  }

  public async update<T>(
    queryName: keyof typeof CrudApiQueryDocuments,
    mutationName: keyof typeof CrudApiMutationDocuments,
    id: string,
    updaterFn: (data: unknown) => T,
  ) {
    Amplify.configure(awsConfig);

    const data: GraphQLResult<queryTypes> = await (<
      Promise<GraphQLResult<queryTypes>>
    >API.graphql({
      query: CrudApiQueryDocuments[<keyof queryTypes>queryName],
      variables: { id },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    }));

    const modified = fp.omit(['createdAt', 'updatedAt'], <IAmplifyModel>{
      ...updaterFn(data?.data?.[<keyof queryTypes>queryName]),
      id,
    });

    return API.graphql({
      query: CrudApiMutationDocuments[mutationName],
      variables: { input: modified },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });
  }

  public async delete(
    mutationName: keyof typeof CrudApiMutationDocuments,
    value: unknown,
  ) {
    Amplify.configure(awsConfig);

    return API.graphql({
      query: CrudApiMutationDocuments[mutationName],
      variables: { input: value },
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });
  }

  public query(params: IQueryParams) {
    Amplify.configure(awsConfig);

    return <Promise<GraphQLResult<apiQueryTypes>>>API.graphql({
      query: CrudApiQueryDocuments[params.queryName] as string,
      variables: params.variables,
      authMode: GRAPHQL_AUTH_MODE.AMAZON_COGNITO_USER_POOLS,
    });
  }

  public subscribe$(params: ISubscriptionParams): Observable<unknown> {
    Amplify.configure(awsConfig);

    return of('subscription').pipe(
      switchMap(
        () => <ObservableInput<ISubscriptionResult>>API.graphql({
            query: CrudApiSubscriptionDocuments[params.subscriptionName],
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
