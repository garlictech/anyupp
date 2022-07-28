import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';

import { BaseCollectionService } from '../../../shared/data-access/ngrx-data';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { ENTITY_NAME } from '../../../shared/types';
import { loggedUserSelectors } from '../../../store/logged-user';
import { UnitProduct } from '@bgap/crud-gql/api';

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
    this._store
      .select(loggedUserSelectors.getSelectedUnitId)
      .pipe(
        tap(unitId => {
          this.patchFilter({
            unitId,
            deletedAt: null,
          });
        }),
        takeUntil(destroyConnection$),
      )
      .subscribe();
  };
}
