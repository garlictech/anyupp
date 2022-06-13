import { combineLatest, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { UnitProduct } from '@bgap/domain';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';

import { BaseCollectionService } from '../../../shared/data-access/ngrx-data';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { ENTITY_NAME } from '../../../shared/types';
import { loggedUserSelectors } from '../../../store/logged-user';

@Injectable({ providedIn: 'root' })
export class UnitProductCollectionService extends BaseCollectionService<UnitProduct> {
  constructor(
    private _store: Store,
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.UNIT_PRODUCT, serviceElementsFactory, crudSdk);
  }

  public init = (destroyConnection$: Subject<boolean>) => {
    combineLatest([
      this._store.select(loggedUserSelectors.getSelectedChainId),
      this._store.select(loggedUserSelectors.getSelectedGroupId),
      this._store.select(loggedUserSelectors.getSelectedUnitId),
    ])
      .pipe(
        tap(([chainId, groupId, unitId]) => {
          this.patchFilter({
            chainId,
            groupId,
            unitId,
            deletedAt: null,
          });
        }),
        takeUntil(destroyConnection$),
      )
      .subscribe();
  };
}
