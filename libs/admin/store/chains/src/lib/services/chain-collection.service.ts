import { Subject } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { BaseCollectionService } from '@bgap/admin/shared/data-access/ngrx-data';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { ENTITY_NAME } from '@bgap/admin/shared/types';
import { appCoreSelectors } from '@bgap/admin/store/app-core';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { filterNullish } from '@bgap/shared/utils';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class ChainCollectionService extends BaseCollectionService<CrudApi.Chain> {
  constructor(
    private _store: Store,
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.CHAIN, serviceElementsFactory, crudSdk);
  }

  public init = (destroyConnection$: Subject<boolean>) => {
    this.getCurrentUserChainFilter$()
      .pipe(
        switchMap(filter => this.getAllCachedPaginatedData$({ filter })),
        takeUntil(destroyConnection$),
      )
      .subscribe();
  };

  public getCurrentUserChainFilter$() {
    return this._store.select(loggedUserSelectors.getLoggedUser).pipe(
      filterNullish(),
      switchMap(loggedUser =>
        this._store.select(
          appCoreSelectors.getChainRestrictionsByUserId(loggedUser?.id),
        ),
      ),
      map(chainRestrictions => {
        const filter: { or: { id: { eq: string } }[] } = {
          or: [],
        };

        chainRestrictions.forEach(chainId => {
          filter.or.push({ id: { eq: chainId } });
        });

        return filter;
      }),
      take(1),
    );
  }
}
