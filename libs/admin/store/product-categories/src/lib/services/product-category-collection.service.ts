import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { BaseCollectionService } from '@bgap/admin/shared/data-access/ngrx-data';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { ENTITY_NAME } from '@bgap/admin/shared/types';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';
import { Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ProductCategoryCollectionService extends BaseCollectionService<CrudApi.ProductCategory> {
  constructor(
    private _store: Store,
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.PRODUCT_CATEGORY, serviceElementsFactory, crudSdk);
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
