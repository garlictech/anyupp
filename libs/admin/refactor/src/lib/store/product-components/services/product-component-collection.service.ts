import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ProductComponent } from '@bgap/domain';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';

import { BaseCollectionService } from '../../../shared/data-access/ngrx-data';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { ENTITY_NAME } from '../../../shared/types';
import { loggedUserSelectors } from '../../../store/logged-user';

@Injectable({ providedIn: 'root' })
export class ProductComponentCollectionService extends BaseCollectionService<ProductComponent> {
  constructor(
    private _store: Store,
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.PRODUCT_COMPONENT, serviceElementsFactory, crudSdk);
  }

  public init = (destroyConnection$: Subject<boolean>) => {
    // Load all chains on startup
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
              deletedAt: { exists: false },
            },
          }),
        ),
        takeUntil(destroyConnection$),
      )
      .subscribe();
  };
}
