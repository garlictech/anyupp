import { Injectable } from '@angular/core';
import { BaseCollectionService } from '@bgap/admin/shared/data-access/ngrx-data';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { ENTITY_NAME } from '@bgap/admin/shared/types';
import * as CrudApi from '@bgap/crud-gql/api';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';

@Injectable({ providedIn: 'root' })
export class AdminUserCollectionService extends BaseCollectionService<CrudApi.AdminUser> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.ADMIN_USER, serviceElementsFactory, crudSdk);
  }
}
