import { partition } from 'lodash/fp';
import { combineLatest, defer, EMPTY, from, iif, Observable, of } from 'rxjs';
import {
  debounceTime,
  filter,
  map,
  mapTo,
  startWith,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ProductOrderChangeEvent } from '@bgap/shared/types';
import { customNumberCompare, filterNullish } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';

import { ConfirmDialogComponent } from '../../../shared/components';
import { PAGINATION_LIMIT } from '../../../shared/data-access/ngrx-data';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { catchGqlError } from '../../../store/app-core';
import { loggedUserSelectors } from '../../../store/logged-user';
import {
  productsSelectors,
  UnitProductCollectionService,
} from '../../../store/products';
import { foundIn } from '../fn';

interface CGU<T> {
  unit?: T;
}

const INITIAL_TOKENS = {
  unit: undefined,
};

@Injectable()
export class ProductListService {
  private _nextToken: CGU<string> = { ...INITIAL_TOKENS };
  private _working: CGU<boolean> = {
    unit: false,
  };

  constructor(
    private _store: Store,
    private _unitProductCollectionService: UnitProductCollectionService,
    private _crudSdk: CrudSdkService,
    private _nbDialogService: NbDialogService,
  ) {
    combineLatest([
      this._store.select(loggedUserSelectors.getSelectedProductCategoryId),
      this._store.select(loggedUserSelectors.getSelectedUnitId),
    ]).subscribe(() => {
      this.resetNextTokens();
    });
  }

  public unitProducts$(searchValueChanges: Observable<string>) {
    return combineLatest([
      searchValueChanges.pipe(debounceTime(200), startWith('')),
      this._store
        .select(productsSelectors.getUnitProductsOfSelectedCategory)
        .pipe(map(products => products.sort(customNumberCompare('position')))),
    ]).pipe(
      switchMap(([searchValue, unitProducts]) => {
        const [dirtyUnitProducts, cleanUnitProducts] = partition(
          p => p.dirty,
          unitProducts,
        );

        return of(
          [...dirtyUnitProducts, ...cleanUnitProducts].filter(p =>
            foundIn(searchValue, p),
          ),
        );
      }),
    );
  }

  public unitProductPositionChange$(
    $event: ProductOrderChangeEvent,
    unitProductIds: string[],
  ) {
    const itemIdx = unitProductIds.indexOf($event.productId);

    if (
      (itemIdx >= 0 &&
        $event.change === 1 &&
        itemIdx < unitProductIds.length - 1) ||
      ($event.change === -1 && itemIdx > 0)
    ) {
      const neighbourId = unitProductIds[itemIdx + $event.change];

      return combineLatest([
        this.updateUnitProductPosition$(
          $event.productId,
          itemIdx + 1 + $event.change,
        ),
        this.updateUnitProductPosition$(neighbourId, itemIdx + 1),
      ]);
    }
    return EMPTY;
  }

  public updateUnitProductPosition$(id: string, position: number) {
    return this._unitProductCollectionService
      .update$({
        id,
        position,
      })
      .pipe(catchGqlError(this._store), take(1));
  }

  public loading$() {
    return this._unitProductCollectionService.loading$;
  }

  public updateLocalizedItemSearchValue(searchValue: string) {
    this._unitProductCollectionService.setCurrentLocalizedItemFilter(
      'name',
      searchValue,
    );
  }

  public resetNextTokens() {
    this._nextToken = { ...INITIAL_TOKENS };
  }

  public loadNextUnitProductPaginatedData() {
    if (!this._working.unit) {
      this._working.unit = true;

      this._store
        .select(loggedUserSelectors.getLoggedUserSettings)
        .pipe(
          filter(settings => !!settings),
          take(1),
          switchMap(settings =>
            iif(
              () => !!settings?.selectedUnitId,
              this._unitProductCollectionService
                .getCachedPaginatedData$({
                  filter: {
                    unitId: { eq: settings?.selectedUnitId },
                    deletedAt: { exists: false },
                  },
                  limit: PAGINATION_LIMIT,
                  nextToken: this._nextToken.unit,
                })
                .pipe(
                  // Load groupProducts
                  switchMap(unitListResult =>
                    from(unitListResult.items.map(i => i.parentId)).pipe(
                      filterNullish(),
                      mapTo(unitListResult),
                    ),
                  ),
                ),
              of(undefined),
            ),
          ),
          take(1),
        )
        .subscribe(result => {
          this._nextToken.unit = result?.nextToken || undefined;
          this._working.unit = false;
        });
    }
  }

  public deleteUnitProduct(id: string) {
    // no childcheck
    this._acceptDeletion$(of(undefined))
      .pipe(
        switchMap(accepted =>
          iif(
            () => accepted,
            defer(() =>
              this._crudSdk.sdk.UpdateUnitProduct({
                input: { id, deletedAt: new Date().toISOString() },
              }),
            ).pipe(
              filterNullish(),
              tap(product => {
                this._unitProductCollectionService.removeOneFromCache(product);
              }),
            ),
            of(undefined),
          ),
        ),
        take(1),
      )
      .subscribe();
  }

  private _acceptDeletion$(
    childCheck$: Observable<Partial<{ items: unknown[] }> | undefined | null>,
  ) {
    return childCheck$.pipe(
      switchMap(childs => {
        const dialog = this._nbDialogService.open(ConfirmDialogComponent);

        return iif(
          () => (childs?.items || []).length === 0,
          defer(
            () =>
              new Observable<boolean>(observer => {
                dialog.componentRef.instance.options = {
                  message: 'products.confirmDeleteProduct',
                  buttons: [
                    {
                      label: 'common.ok',
                      callback: () => {
                        observer.next(true);
                      },
                      status: 'success',
                    },
                    {
                      label: 'common.cancel',
                      status: 'basic',
                      callback: () => {
                        observer.next(false);
                      },
                    },
                  ],
                };
              }),
          ),
          defer(
            () =>
              new Observable<boolean>(observer => {
                dialog.componentRef.instance.options = {
                  message: 'products.productDeletionNotAllowed',
                  buttons: [
                    {
                      label: 'common.ok',
                      callback: () => {
                        observer.next(false);
                      },
                      status: 'success',
                    },
                  ],
                };
              }),
          ),
        );
      }),
    );
  }
}
