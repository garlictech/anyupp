import * as R from 'ramda';
import { partition } from 'lodash/fp';
import {
  combineLatest,
  defer,
  EMPTY,
  forkJoin,
  iif,
  Observable,
  of,
  throwError,
} from 'rxjs';
import {
  delay,
  debounceTime,
  filter,
  map,
  startWith,
  switchMap,
  take,
  tap,
  catchError,
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
import { ToasterService } from '../../../shared/utils';
import { Variant } from '@bgap/domain';
import { pipe } from 'fp-ts/lib/function';

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
    private _toasterService: ToasterService,
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
              this._unitProductCollectionService.getCachedPaginatedData$({
                filter: {
                  unitId: { eq: settings?.selectedUnitId },
                  deletedAt: { exists: false },
                },
                limit: PAGINATION_LIMIT,
                nextToken: this._nextToken.unit,
              }),
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

  public duplicateUnitProduct(id: string) {
    return this._crudSdk.sdk.GetUnitProduct({ id }).pipe(
      switchMap(product =>
        product?.id
          ? this._crudSdk.sdk
              .CreateUnitProduct({
                input: {
                  ...R.omit([
                    'createdAt',
                    'deletedAt',
                    'updatedAt',
                    'id',
                    'variants',
                  ])(product),
                  name: R.map(text => `${text} COPY`, product.name),
                  dirty: true,
                },
              })
              .pipe(
                switchMap(newProduct =>
                  newProduct
                    ? forkJoin(
                        pipe(
                          product.variants?.items ?? [],
                          R.reject(R.isNil),
                          R.map((variant: Variant) =>
                            this._crudSdk.sdk.CreateVariant({
                              input: {
                                ...R.omit(
                                  ['createdAt', 'updatedAt', 'id'],
                                  variant,
                                ),
                                unitProductVariantsId: newProduct.id,
                                isAvailable: variant?.isAvailable || false,
                                position: variant?.position || 0,
                                variantName: variant?.variantName || {
                                  en: 'VARIANT NAME',
                                },
                                price: variant?.price || 0,
                              },
                            }),
                          ),
                        ),
                      )
                    : throwError('Cannot duplicte product'),
                ),
              )
          : of(undefined),
      ),
      delay(3000),
      tap(() => {
        this._toasterService.showSimpleSuccess('simply');
        this.resetNextTokens();
        this.loadNextUnitProductPaginatedData();
      }),
      catchError(() => {
        this._toasterService.showSimpleDanger('simplyError');
        return of({});
      }),
      take(1),
    );
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
