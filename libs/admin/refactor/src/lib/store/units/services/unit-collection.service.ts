import { Injectable } from '@angular/core';
import { Unit } from '@bgap/domain';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { BaseCollectionService } from '../../../shared/data-access/ngrx-data';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { ENTITY_NAME } from '../../../shared/types';

@Injectable({ providedIn: 'root' })
export class UnitCollectionService extends BaseCollectionService<Unit> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.UNIT, serviceElementsFactory, crudSdk);
  }
}
