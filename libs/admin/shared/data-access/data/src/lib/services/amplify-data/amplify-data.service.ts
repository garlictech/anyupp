import { IAmplifyModel } from 'libs/shared/types/src';
import { from, Observable, ObservableInput } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { API, GraphQLResult } from '@aws-amplify/api';
import {
  GetAdminUserQuery, GetChainProductQuery, GetChainQuery, GetGroupQuery, GetOrderQuery, GetProductCategoryQuery, GetUnitQuery, GetUserQuery, ListAdminUsersQuery, ListChainProductsQuery, ListChainsQuery, ListGroupsQuery, ListOrdersQuery, ListProductCategorysQuery, ListUnitsQuery, ListUsersQuery, Mutations, OnAdminUserChangeSubscription,
  OnChainsChangeSubscription,
  OnGroupsChangeSubscription,
  OnUnitsChangeSubscription,
  OnUsersChangeSubscription,
  Queries, Subscriptions
} from '@bgap/admin/amplify';

type queryTypes = GetAdminUserQuery & GetChainQuery & GetGroupQuery & GetUnitQuery & GetOrderQuery & GetProductCategoryQuery & GetChainProductQuery & GetUserQuery;
type listTypes = ListAdminUsersQuery & ListChainsQuery & ListGroupsQuery & ListUnitsQuery & ListOrdersQuery & ListProductCategorysQuery & ListChainProductsQuery & ListUsersQuery;
type apiQueryTypes = queryTypes & listTypes;
type subscriptionTypes = OnAdminUserChangeSubscription & OnChainsChangeSubscription & OnGroupsChangeSubscription & OnUnitsChangeSubscription & OnUsersChangeSubscription;

interface ISubscriptionResult {
  value?: {
    data: subscriptionTypes
  }
}

@Injectable({
  providedIn: 'root',
})
export class AmplifyDataService {
  public snapshotChanges$(
    queryName: keyof typeof Queries,
    subscriptionName: keyof typeof Subscriptions,
    callback: (data: unknown) => void,
    variables?: object,
  ): Observable<unknown> {
    return from(
      <Promise<GraphQLResult<apiQueryTypes>>>API.graphql({
        query: Queries[queryName],
        variables,
      }),
    ).pipe(
      take(1),
      tap((data) => {
        if (data.data?.[<keyof listTypes>queryName]?.items) {
          (data.data?.[<keyof listTypes>queryName]?.items || []) .forEach((d: unknown) => {
            callback(d);
          });
        } else if (data?.data?.[<keyof queryTypes>queryName]) {
          callback(data?.data?.[<keyof queryTypes>queryName]);
        }
      }),
      switchMap(
        () => <ObservableInput<ISubscriptionResult>> API.graphql({
            query: Subscriptions[subscriptionName],
            variables,
          }),
      ),
      tap( (data: ISubscriptionResult) => {
        callback(data?.value?.data?.[<keyof subscriptionTypes>subscriptionName]);
      }),
    );
  }

  public async create(mutationName: keyof typeof Mutations, value: unknown) {
    return API.graphql({ query: Mutations[mutationName], variables: { input: value } });
  }

  public async update(
    queryName: keyof typeof Queries,
    mutationName: keyof typeof Mutations,
    id: string,
    updaterFn: (data: unknown) => {},
  ) {
    const data: GraphQLResult<queryTypes> = await <Promise<GraphQLResult<queryTypes>>>API.graphql({
      query: Queries[<keyof queryTypes>queryName],
      variables: { id },
    });

    const { createdAt, updatedAt, ...modified } = <IAmplifyModel>{
      ...updaterFn(data?.data?.[<keyof queryTypes>queryName]),
      id,
    };

    return API.graphql({
      query: Mutations[mutationName],
      variables: { input: modified },
    });
  }
}
