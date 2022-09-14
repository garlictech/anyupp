import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ProductCategory } from '@bgap/domain';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';

import { BaseCollectionService } from '../../../shared/data-access/ngrx-data';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { ENTITY_NAME } from '../../../shared/types';
import { loggedUserSelectors } from '../../../store/logged-user';

@Injectable({ providedIn: 'root' })
export class ProductCategoryCollectionService extends BaseCollectionService<ProductCategory> {
  constructor(
    private _store: Store,
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.PRODUCT_CATEGORY, serviceElementsFactory, crudSdk);
  }

  public init = (destroyConnection$: Subject<boolean>) => {
    this._store
      .select(loggedUserSelectors.getSelectedUnitId)
      .pipe(
        tap(selectedUnitId => {
          // Update filter on settings change
          this.patchFilter({
            ownerEntity: selectedUnitId,
          });
        }),
        switchMap(selectedUnitId =>
          // Load all data on settings change
          this.getAllCachedPaginatedData$({
            filter: {
              ownerEntity: { eq: selectedUnitId },
            },
          }),
        ),
        takeUntil(destroyConnection$),
      )
      .subscribe();
  };
}
