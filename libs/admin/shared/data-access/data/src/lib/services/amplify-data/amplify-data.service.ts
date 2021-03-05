import { NGXLogger } from 'ngx-logger';
import { from, Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { API, GraphQLResult } from '@aws-amplify/api';
import { ListAdminUsersQuery, Mutations, Queries, Subscriptions } from '@bgap/admin/amplify';

interface IQueryResult<T> {
  data?: ListAdminUsersQuery
}

@Injectable({
  providedIn: 'root',
})
export class AmplifyDataService {
  constructor(private _logger: NGXLogger) {}

  public snapshotChanges$<callbackT>(
    queryName: string,
    variables: object | undefined,
    subscriptionName: string,
    callback: (data: callbackT) => void,
  ): Observable<unknown> {
    return from(
      <Promise<GraphQLResult>>API.graphql({
        query: (<any>Queries)[queryName],
        variables,
      }),
    ).pipe(
      take(1),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tap((data: any) => {
        if (data.data?.[queryName]?.items) {
          (data.data[queryName].items || []).forEach((d: any) => {
            callback(d);
          });
        } else {
          callback(data?.data?.[queryName]);
        }
      }),
      switchMap(
        () => <any>API.graphql({
            query: (<any>Subscriptions)[subscriptionName],
            variables,
          }),
      ),
      tap({
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        next: (data: any) => {
          callback(data.value.data[subscriptionName]);
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        error: (error: any) =>
          this._logger.error(`Subscription error ${JSON.stringify(error)}`),
      }),
    );
  }

  /*
  public async snapshotChanges<T>(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    queryName: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    variables: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    subscriptionName: any,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    callback: any,
  ): Promise<void> {
    const data: any = await API.graphql({
      query: (<any>Queries)[queryName],
      variables,
    });

    if (data?.data[queryName]?.items) {
      (data?.data[queryName].items).forEach((d: T) => {
        callback(d);
      });
    } else {
      callback(data?.data[queryName]);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (<any>(
      API.graphql(
        {
          query: (<any>Subscriptions)[subscriptionName],
          variables,
        }
      )
    )).subscribe({
      next: (data: any) => {
        callback(<T>data.value.data[subscriptionName]);
      },
      error: (error: any) =>
        this._logger.error(`Subscription error ${JSON.stringify(error)}`),
    });
  }
  */

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async create(mutation: any, value: any) {
    return API.graphql({ query: mutation, variables: { input: value } });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public async update(
    queryName: string,
    mutationName: string,
    id: any,
    updaterFn: any,
  ) {
    const data: any = await API.graphql({
      query: (<any>Queries)[queryName],
      variables: { id },
    });

    const { createdAt, updatedAt, ...modified } = <any>{
      ...updaterFn(data.data[queryName]),
      id,
    };

    return API.graphql({
      query: (<any>Mutations)[mutationName],
      variables: { input: modified },
    });
  }
}
