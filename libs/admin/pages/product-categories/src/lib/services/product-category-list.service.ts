import { combineLatest, EMPTY } from 'rxjs';
import { take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { catchGqlError } from '@bgap/admin/store/app-core';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { ProductCategoryOrderChangeEvent } from '@bgap/shared/types';
import { Store } from '@ngrx/store';

@Injectable()
export class ProductCategoryListService {
  constructor(private _store: Store, private _crudSdk: CrudSdkService) {}

  public positionChange(
    $event: ProductCategoryOrderChangeEvent,
    categoryIds: string[],
  ) {
    const itemIdx = categoryIds.indexOf($event.productCategoryId);

    if (
      (itemIdx >= 0 &&
        $event.change === 1 &&
        itemIdx < categoryIds.length - 1) ||
      ($event.change === -1 && itemIdx > 0)
    ) {
      const neighbourId = categoryIds[itemIdx + $event.change];

      return combineLatest([
        this.updateUnitProductCategoryPosition$(
          $event.productCategoryId,
          itemIdx + 1 + $event.change,
        ),
        this.updateUnitProductCategoryPosition$(neighbourId, itemIdx + 1),
      ]);
    }

    return EMPTY;
  }

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
