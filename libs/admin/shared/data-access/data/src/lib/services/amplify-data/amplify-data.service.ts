import * as fp from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { Injectable, NgZone } from '@angular/core';
import { CrudApiMutationDocuments, CrudApiQueryDocuments, CrudApiSubscriptionDocuments } from '@bgap/crud-gql/api';
import {
  crudAuthenticatedGraphqlClient, executeMutation, executeQuery, executeSubscription
} from '@bgap/shared/graphql/api-client';
import { IAmplifyModel } from '@bgap/shared/types';
import { removeNestedTypeNameField } from '@bgap/shared/utils';

import { listTypes, queryTypes, subscriptionTypes } from './types';

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
  constructor(private _ngZone: NgZone) {}

  public snapshotChanges$(params: ISnapshotParams): Observable<unknown> {
    return executeQuery(crudAuthenticatedGraphqlClient)(
      CrudApiQueryDocuments[params.queryName],
      params.variables,
    ).pipe(
      take(1),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tap((data: any) => {
        this._ngZone.run(() => {
          if (params.resetFn) {
            params.resetFn();
          }

          if (data?.[<keyof listTypes>params.queryName]?.items) {
            (data?.[<keyof listTypes>params.queryName]?.items || []).forEach(
              (d: unknown) => {
                params.upsertFn(removeNestedTypeNameField(d));
              },
            );
          } else if (data?.[<keyof queryTypes>params.queryName]) {
            params.upsertFn(removeNestedTypeNameField(data?.[<keyof queryTypes>params.queryName]));
          }
        });
      }),
      switchMap(() => {
        return executeSubscription(crudAuthenticatedGraphqlClient)(
          CrudApiSubscriptionDocuments[params.subscriptionName],
          params.variables,
        );
      }),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tap((data: any) => {
        this._ngZone.run(() => {
          params.upsertFn(
            removeNestedTypeNameField(data?.[<keyof subscriptionTypes>params.subscriptionName]),
          );
        });
      }),
    );
  }

  public async create(
    mutationName: keyof typeof CrudApiMutationDocuments,
    value: unknown,
  ) {
    return executeMutation(
      crudAuthenticatedGraphqlClient,
    )(CrudApiMutationDocuments[mutationName], { input: value }).toPromise();
  }

  // Update the whole record
  public async update<T>(
    queryName: keyof typeof CrudApiQueryDocuments,
    mutationName: keyof typeof CrudApiMutationDocuments,
    id: string,
    updaterFn: (data: unknown) => T,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await executeQuery(crudAuthenticatedGraphqlClient)<T>(
      CrudApiQueryDocuments[<keyof queryTypes>queryName],
      { id },
    ).toPromise();

    const modified = fp.omit(['createdAt', 'updatedAt'], <IAmplifyModel>{
      ...updaterFn(removeNestedTypeNameField(data?.[<keyof queryTypes>queryName])),
      id,
    });

    return executeMutation(
      crudAuthenticatedGraphqlClient,
    )(CrudApiMutationDocuments[mutationName], { input: modified }).toPromise();
  }

  // Update some fields
  public async patch(
    mutationName: keyof typeof CrudApiMutationDocuments,
    input: Record<string, unknown>
  ) {
    return executeMutation(
      crudAuthenticatedGraphqlClient,
    )(CrudApiMutationDocuments[mutationName], { input }).toPromise();
  }

  public async delete(
    mutationName: keyof typeof CrudApiMutationDocuments,
    value: unknown,
  ) {
    return executeMutation(
      crudAuthenticatedGraphqlClient,
    )(CrudApiMutationDocuments[mutationName], { input: value }).toPromise();
  }

  public query<T>(params: IQueryParams) {
    return executeQuery(crudAuthenticatedGraphqlClient)<T>(
      CrudApiQueryDocuments[params.queryName],
      params.variables,
    ).toPromise();
  }

  public subscribe$(params: ISubscriptionParams): Observable<unknown> {
    return of('subscription').pipe(
      switchMap(() =>
        executeSubscription(crudAuthenticatedGraphqlClient)(
          CrudApiSubscriptionDocuments[params.subscriptionName],
          params.variables,
        ),
      ),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      tap((data: any) => {
        this._ngZone.run(() => {

        params.upsertFn(
          removeNestedTypeNameField(data?.[<keyof subscriptionTypes>params.subscriptionName]),
        );

        });
      }),
    );
  }
}
