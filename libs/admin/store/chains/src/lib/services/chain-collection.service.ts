import { Injectable } from '@angular/core';
import { BaseCollectionService } from '@bgap/admin/shared/data-access/ngrx-data';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { ENTITY_NAME } from '@bgap/admin/shared/types';
import * as CrudApi from '@bgap/crud-gql/api';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ChainCollectionService extends BaseCollectionService<CrudApi.Chain> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.CHAIN, serviceElementsFactory, crudSdk);
  }

  public init = (destroyConnection$: Subject<boolean>) => {
    // Load all chains on startup
    this.getAllCachedPaginatedData$({})
      .pipe(takeUntil(destroyConnection$))
      .subscribe();
  };
}
