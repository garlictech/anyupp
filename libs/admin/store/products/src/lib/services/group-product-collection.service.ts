import { combineLatest, Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { BaseCollectionService } from '@bgap/admin/shared/data-access/ngrx-data';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { ENTITY_NAME } from '@bgap/admin/shared/types';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class GroupProductCollectionService extends BaseCollectionService<CrudApi.GroupProduct> {
  constructor(
    private _store: Store,
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.GROUP_PRODUCT, serviceElementsFactory, crudSdk);
  }

  public init = (destroyConnection$: Subject<boolean>) => {
    combineLatest([
      this._store.select(loggedUserSelectors.getSelectedChainId),
      this._store.select(loggedUserSelectors.getSelectedGroupId),
    ])
      .pipe(
        tap(([chainId, groupId]) => {
          this.patchFilter({
            chainId,
            groupId,
          });
        }),
        takeUntil(destroyConnection$),
      )
      .subscribe();
  };
}
