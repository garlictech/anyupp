import { Subject } from 'rxjs';
import { map, switchMap, take, takeUntil } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { Chain } from '@bgap/domain';
import { filterNullish } from '@bgap/shared/utils';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';

import { BaseCollectionService } from '../../../shared/data-access/ngrx-data';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { ENTITY_NAME } from '../../../shared/types';
import { appCoreSelectors } from '../../../store/app-core';
import { loggedUserSelectors } from '../../../store/logged-user';

@Injectable({ providedIn: 'root' })
export class ChainCollectionService extends BaseCollectionService<Chain> {
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
