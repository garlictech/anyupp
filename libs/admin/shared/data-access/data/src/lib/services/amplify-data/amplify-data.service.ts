import * as fp from 'lodash/fp';
import { from, Observable, ObservableInput } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { API, GraphQLResult } from '@aws-amplify/api';
import {
  GetAdminUserQuery,
  GetChainProductQuery,
  GetChainQuery,
  GetGroupQuery,
  GetOrderQuery,
  GetProductCategoryQuery,
  GetUnitQuery,
  GetUserQuery,
  ListAdminUsersQuery,
  ListChainProductsQuery,
  ListChainsQuery,
  ListGroupsQuery,
  ListOrdersQuery,
  ListProductCategorysQuery,
  ListUnitsQuery,
  ListUsersQuery,
  Mutations,
  OnAdminUserChangeSubscription,
  OnChainsChangeSubscription,
  OnGroupsChangeSubscription,
  OnProductCategoriesChangeSubscription,
  OnUnitsChangeSubscription,
  OnUsersChangeSubscription,
  Queries,
  Subscriptions,
} from '@bgap/admin/amplify-api';
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

interface ISnapshotParams {
  queryName: keyof typeof Queries;
  subscriptionName: keyof typeof Subscriptions;
  resetFn?: () => void;
  upsertFn: (data: unknown) => void;
  variables?: Record<string, unknown>;
}

@Injectable({
  providedIn: 'root',
})
export class AmplifyDataService {
  public snapshotChanges$(params: ISnapshotParams): Observable<unknown> {
    return from(
      <Promise<GraphQLResult<apiQueryTypes>>>API.graphql({
        query: Queries[params.queryName],
        variables: params.variables,
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
            query: Subscriptions[params.subscriptionName],
            variables: params.variables,
          }),
      ),
      tap((data: ISubscriptionResult) => {
        // TODO delete object???
        params.upsertFn(
          data?.value?.data?.[<keyof subscriptionTypes>params.subscriptionName],
        );
      }),
    );
  }

  public async create(mutationName: keyof typeof Mutations, value: unknown) {
    return API.graphql({
      query: Mutations[mutationName],
      variables: { input: value },
    });
  }

  public async update<T>(
    queryName: keyof typeof Queries,
    mutationName: keyof typeof Mutations,
    id: string,
    updaterFn: (data: unknown) => T,
  ) {
    const data: GraphQLResult<queryTypes> = await (<
      Promise<GraphQLResult<queryTypes>>
    >API.graphql({
      query: Queries[<keyof queryTypes>queryName],
      variables: { id },
    }));

    const modified = fp.omit(['createdAt', 'updatedAt'], <IAmplifyModel>{
      ...updaterFn(data?.data?.[<keyof queryTypes>queryName]),
      id,
    });

    return API.graphql({
      query: Mutations[mutationName],
      variables: { input: modified },
    });
  }
}
