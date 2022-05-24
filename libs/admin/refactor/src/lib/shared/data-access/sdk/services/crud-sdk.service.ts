import { Injectable } from '@angular/core';
import { catchGqlError } from '../../../../store/app-core';
import * as CrudApi from '@bgap/crud-gql/api';
import { getCrudSdkForUserPool } from '@bgap/crud-gql/api';
import { filterNullish, filterNullishElements } from '@bgap/shared/utils';
import { Store } from '@ngrx/store';
import { TypedAction } from '@ngrx/store/src/models';
import { concat, Observable } from 'rxjs';
import { map, takeUntil, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CrudSdkService {
  public sdk: CrudApi.CrudSdk;

  constructor(private _store: Store) {
    this.sdk = getCrudSdkForUserPool();
  }

  public doListSubscription<T>(
    resetFn: () => void,
    listOp: Observable<
      | { items?: Array<T | undefined | null> | undefined | null }
      | undefined
      | null
    >,
    subscriptionOp: Observable<T | null | undefined>,
    upsertFn: (items: T[]) => void,
    destroyConnection$: Observable<unknown>,
  ) {
    if (resetFn) {
      resetFn();
    }
    concat(
      listOp.pipe(
        filterNullish(),
        map(list => list.items),
      ),
      subscriptionOp.pipe(
        filterNullish(),
        map(item => [item]),
      ),
    )
      .pipe(
        filterNullishElements(),
        tap(items => upsertFn(items)),
        takeUntil(destroyConnection$),
        catchGqlError(this._store),
      )
      .subscribe();
  }

  public doListQuery<T>(
    resetAction: TypedAction<string> | undefined,
    listOp: Observable<
      | { items?: Array<T | undefined | null> | undefined | null }
      | undefined
      | null
    >,
    upsertActionCreator: (items: T[]) => TypedAction<string>,
  ) {
    if (resetAction) {
      this._store.dispatch(resetAction);
    }

    listOp
      .pipe(
        filterNullish(),
        map(list => list.items),
        filterNullishElements(),
        tap(items => this._store.dispatch(upsertActionCreator(items))),
        catchGqlError(this._store),
      )
      .subscribe();
  }

  public doMutation<T>(mutationOp: Observable<T | null | undefined>) {
    return mutationOp.pipe(catchGqlError(this._store));
  }
}

/*import * as fp from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { Injectable, NgZone } from '@angular/core';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  executeMutation,
  executeQuery,
  executeSubscription,
} from '@bgap/shared/graphql/api-client';
import { AmplifyModel } from '@bgap/shared/types';
import { removeNestedTypeNameField } from '@bgap/shared/utils';

import { listTypes, queryTypes, subscriptionTypes } from './types';
import { AngularApi, getCrudSdkForUserPool } from '@bgap/crud-gql/api';
import { DocumentNode } from 'graphql';

interface ISubscriptionParams {
  subscriptionName: string;
  resetFn?: () => void;
  upsertFn: (data: unknown) => void;
  variables?: Record<string, unknown>;
}

interface IQueryParams {
  query: DocumentNode;
  variables?: Record<string, unknown>;
}

interface ISnapshotParams extends ISubscriptionParams, IQueryParams {}

@injectable({
  providedin: 'root',
})
export class AmplifyDataService {
  private crudSdk: CrudApi.CrudSdk;

  constructor(private _ngZone: NgZone, private sdk: AngularApi.OnAdminUserChangeGQL ) {
    this._crudSdk = getCrudSdkForUserPool();

    this.sdk.subscribe({id: 'lofasz'})
  }

  /*public snapshotChanges$(params: ISnapshotParams): Observable<unknown> {
    return executeQuery(
      params.query,
      <keyof queryTypes>params.queryName,
      params.variables,
    )(this.crudAuthenticatedGraphqlClient).pipe(
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
            params.upsertFn(
              removeNestedTypeNameField(
                data?.[<keyof queryTypes>params.queryName],
              ),
            );
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
            removeNestedTypeNameField(
              data?.[<keyof subscriptionTypes>params.subscriptionName],
            ),
          );
        });
      }),
    );
  }



  public async create(mutationName: keyof typeof CrudApi, value: unknown) {
    return executeMutation(crudAuthenticatedGraphqlClient)(
      CrudApi[mutationName],
      { input: value },
    ).toPromise();
  }

  // Update the whole record
  public async update<T>(
    queryName: keyof typeof CrudApi,
    mutationName: keyof typeof CrudApi,
    id: string,
    updaterFn: (data: unknown) => T,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const data: any = await executeQuery(crudAuthenticatedGraphqlClient)<T>(
      CrudApi[<keyof queryTypes>queryName],
      { id },
    ).toPromise();

    const modified = fp.omit(['createdAt', 'updatedAt'], <AmplifyModel>{
      ...updaterFn(
        removeNestedTypeNameField(data?.[<keyof queryTypes>queryName]),
      ),
      id,
    });

    return executeMutation(crudAuthenticatedGraphqlClient)(
      CrudApi[mutationName],
      { input: modified },
    ).toPromise();
  }

  // Update some fields
  public async patch(
    mutationName: keyof typeof CrudApiMutationDocuments,
    input: Record<string, unknown>
  ) {
    return executeMutation(
      crudAuthenticatedGraphqlClient,
  public query<T>(params: IQueryParams) {
    return executeQuery(crudAuthenticatedGraphqlClient)<T>(
      CrudApi[params.queryName],
      params.variables,
    ).toPromise();

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
            removeNestedTypeNameField(
              data?.[<keyof subscriptionTypes>params.subscriptionName],
            ),
          );
        });
      }),
    );
}
}
  */
