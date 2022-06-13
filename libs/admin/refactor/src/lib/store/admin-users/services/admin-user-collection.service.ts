import { Injectable } from '@angular/core';
import { AdminUser } from '@bgap/domain';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { BaseCollectionService } from '../../../shared/data-access/ngrx-data';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { ENTITY_NAME } from '../../../shared/types';

@Injectable({ providedIn: 'root' })
export class AdminUserCollectionService extends BaseCollectionService<AdminUser> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.ADMIN_USER, serviceElementsFactory, crudSdk);
  }
}
