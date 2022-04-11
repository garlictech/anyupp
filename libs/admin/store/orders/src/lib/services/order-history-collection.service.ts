import { takeUntil, tap } from 'rxjs/operators';

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
export class OrderHistoryCollectionService extends BaseCollectionService<CrudApi.Order> {
  constructor(
    private _store: Store,
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.ORDER_HISTORY, serviceElementsFactory, crudSdk);
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
        takeUntil(destroyConnection$),
      )
      .subscribe();
  };
}
