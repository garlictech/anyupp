import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { BaseCollectionService } from '../../../shared/data-access/ngrx-data';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { ENTITY_NAME } from '../../../shared/types';
import { loggedUserSelectors } from '../../../store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class GroupCollectionService extends BaseCollectionService<CrudApi.Group> {
  constructor(
    private _store: Store,
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.GROUP, serviceElementsFactory, crudSdk);
  }

  public init = (destroyConnection$: Subject<boolean>) => {
    this._store
      .select(loggedUserSelectors.getSelectedChainId)
      .pipe(
        tap(selectedChainId => {
          // Update filter on settings change
          this.patchFilter({
            chainId: selectedChainId,
          });
        }),
        switchMap(selectedChainId =>
          // Load all data on settings change
          this.getAllCachedPaginatedData$({
            filter: {
              chainId: { eq: selectedChainId },
            },
          }),
        ),
        takeUntil(destroyConnection$),
      )
      .subscribe();
  };
}
