import { Subject } from 'rxjs';
import { switchMap, takeUntil, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { GeneratedProduct } from '@bgap/domain';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';

import { BaseCollectionService } from '../../../shared/data-access/ngrx-data';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { ENTITY_NAME } from '../../../shared/types';
import { loggedUserSelectors } from '../../../store/logged-user';

@Injectable({ providedIn: 'root' })
export class GeneratedProductCollectionService extends BaseCollectionService<GeneratedProduct> {
  constructor(
    private _store: Store,
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.GENERATED_PRODUCT, serviceElementsFactory, crudSdk);
  }

  public init = (destroyConnection$: Subject<boolean>) => {
    this._store
      .select(loggedUserSelectors.getSelectedUnitId)
      .pipe(
        tap(selectedUnitId => {
          // Update filter on settings change
          this.patchFilter({
            unitId: selectedUnitId,
          });
        }),
        switchMap(selectedUnitId =>
          // Load all data on settings change
          this.getAllCachedPaginatedData$({
            filter: {
              unitId: { eq: selectedUnitId },
            },
          }),
        ),
        takeUntil(destroyConnection$),
      )
      .subscribe();
  };
}
