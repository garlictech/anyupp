import { take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { catchGqlError } from '@bgap/admin/shared/data-access/app-core';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { Store } from '@ngrx/store';

@Injectable()
export class ProductCategoryListService {
  constructor(private _store: Store, private _crudSdk: CrudSdkService) {}

  public updateUnitProductCategoryPosition$(id: string, position: number) {
    return this._crudSdk.sdk
      .UpdateProductCategory({
        input: {
          id,
          position,
        },
      })
      .pipe(catchGqlError(this._store), take(1));
  }
}
