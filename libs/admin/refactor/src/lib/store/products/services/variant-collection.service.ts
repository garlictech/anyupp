import { Injectable } from '@angular/core';
import { EntityCollectionServiceElementsFactory } from '@ngrx/data';

import { BaseCollectionService } from '../../../shared/data-access/ngrx-data';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { ENTITY_NAME } from '../../../shared/types';
import { Variant } from '@bgap/crud-gql/api';

@Injectable({ providedIn: 'root' })
export class VariantCollectionService extends BaseCollectionService<Variant> {
  constructor(
    serviceElementsFactory: EntityCollectionServiceElementsFactory,
    crudSdk: CrudSdkService,
  ) {
    super(ENTITY_NAME.VARIANT, serviceElementsFactory, crudSdk);
  }
}
