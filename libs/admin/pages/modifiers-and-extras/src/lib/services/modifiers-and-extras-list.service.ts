import { combineLatest, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { PAGINATION_LIMIT } from '@bgap/admin/shared/data-access/ngrx-data';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import { ProductComponentSetCollectionService } from '@bgap/admin/store/product-component-sets';
import { ProductComponentCollectionService } from '@bgap/admin/store/product-components';
import { Store } from '@ngrx/store';

interface CS<T> {
  component?: T;
  componentSet?: T;
}

@Injectable()
export class ModifiersAndExtrasListService {
  private _nextToken: CS<string> = {
    component: undefined,
    componentSet: undefined,
  };
  private _working: CS<boolean> = {
    component: false,
    componentSet: false,
  };
  private _selectedChainId?: string | null;

  constructor(
    private _store: Store,
    private _productComponentCollectionService: ProductComponentCollectionService,
    private _productComponentSetCollectionService: ProductComponentSetCollectionService,
  ) {
    this._store
      .select(loggedUserSelectors.getSelectedChainId)
      .subscribe(selectedChainId => {
        this._selectedChainId = selectedChainId;
      });
  }

  public loading$() {
    return combineLatest([
      this._productComponentCollectionService.loading$,
      this._productComponentSetCollectionService.loading$,
    ]).pipe(
      switchMap(([componentLoading, componentSetLoading]) =>
        of(componentLoading || componentSetLoading),
      ),
    );
  }

  public resetNextTokens() {
    this._nextToken = { component: undefined, componentSet: undefined };
  }

  public loadNextProductComponentPaginatedData() {
    if (!this._working.component) {
      this._working.component = true;

      this._productComponentCollectionService
        .getCachedPaginatedData$({
          limit: PAGINATION_LIMIT,
          nextToken: this._nextToken.component,
          filter: {
            chainId: { eq: this._selectedChainId },
          },
        })
        .subscribe(result => {
          this._nextToken.component = result?.nextToken || undefined;
          this._working.component = false;
        });
    }
  }

  public loadNextProductComponentSetPaginatedData() {
    if (!this._working.componentSet) {
      this._working.componentSet = true;

      this._productComponentSetCollectionService
        .getCachedPaginatedData$({
          limit: PAGINATION_LIMIT,
          nextToken: this._nextToken.componentSet,
          filter: {
            chainId: { eq: this._selectedChainId },
          },
        })
        .subscribe(result => {
          this._nextToken.componentSet = result?.nextToken || undefined;
          this._working.componentSet = false;
        });
    }
  }
}
