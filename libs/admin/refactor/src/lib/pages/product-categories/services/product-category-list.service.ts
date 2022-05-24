import { combineLatest, EMPTY } from 'rxjs';
import { take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { PAGINATION_LIMIT } from '../../../shared/data-access/ngrx-data';
import { catchGqlError } from '../../../store/app-core';
import { loggedUserSelectors } from '../../../store/logged-user';
import { ProductCategoryCollectionService } from '../../../store/product-categories';
import { ProductCategoryOrderChangeEvent } from '@bgap/shared/types';
import { Store } from '@ngrx/store';

@Injectable()
export class ProductCategoryListService {
  private _nextToken?: string;
  private _working = false;
  private _selectedChainId?: string | null;

  constructor(
    private _store: Store,
    private _productCategoryCollectionService: ProductCategoryCollectionService,
  ) {
    this._store
      .select(loggedUserSelectors.getSelectedChainId)
      .subscribe(selectedChainId => {
        this._selectedChainId = selectedChainId;
      });
  }

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
    return this._productCategoryCollectionService
      .update$({
        id,
        position,
      })
      .pipe(catchGqlError(this._store), take(1));
  }

  public resetNextTokens() {
    this._nextToken = undefined;
  }

  public loadNextPaginatedData() {
    if (!this._working && this._selectedChainId) {
      this._working = true;

      this._productCategoryCollectionService
        .getCachedPaginatedData$({
          limit: PAGINATION_LIMIT,
          nextToken: this._nextToken,
          filter: {
            chainId: { eq: this._selectedChainId },
          },
        })
        .subscribe(result => {
          this._nextToken = result?.nextToken || undefined;
          this._working = false;
        });
    }
  }
}
