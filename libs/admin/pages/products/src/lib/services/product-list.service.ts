import { partition } from 'lodash/fp';
import { combineLatest, defer, EMPTY, from, iif, Observable, of } from 'rxjs';
import {
  debounceTime,
  map,
  mapTo,
  filter,
  mergeMap,
  startWith,
  switchMap,
  take,
  tap,
  toArray,
} from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ConfirmDialogComponent } from '@bgap/admin/shared/components';
import { PAGINATION_LIMIT } from '@bgap/admin/shared/data-access/ngrx-data';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { catchGqlError } from '@bgap/admin/store/app-core';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import {
  ChainProductCollectionService,
  GroupProductCollectionService,
  productsSelectors,
  UnitProductCollectionService,
} from '@bgap/admin/store/products';
import * as CrudApi from '@bgap/crud-gql/api';
import { ProductOrderChangeEvent } from '@bgap/shared/types';
import { customNumberCompare, filterNullish } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';

import { foundIn } from '../fn';

interface CGU<T> {
  chain?: T;
  group?: T;
  unit?: T;
}

const INITIAL_TOKENS = {
  chain: undefined,
  group: undefined,
  unit: undefined,
};

@Injectable()
export class ProductListService {
  private _nextToken: CGU<string> = { ...INITIAL_TOKENS };
  private _working: CGU<boolean> = {
    chain: false,
    group: false,
    unit: false,
  };

  constructor(
    private _store: Store,
    private _chainProductCollectionService: ChainProductCollectionService,
    private _groupProductCollectionService: GroupProductCollectionService,
    private _unitProductCollectionService: UnitProductCollectionService,
    private _crudSdk: CrudSdkService,
    private _nbDialogService: NbDialogService,
  ) {
    combineLatest([
      this._store.select(loggedUserSelectors.getSelectedProductCategoryId),
      this._store.select(loggedUserSelectors.getSelectedChainId),
      this._store.select(loggedUserSelectors.getSelectedGroupId),
      this._store.select(loggedUserSelectors.getSelectedUnitId),
    ]).subscribe(() => {
      this.resetNextTokens();
    });
  }

  public hasRoleToEdit$(/*productLevel: EProductLevel*/) {
    return of(true);
    /*
    return this._store.select(loggedUserSelectors.getLoggedUserRole).pipe(
      map((role: CrudApi.Role | undefined) => {
        switch (productLevel) {
          case EProductLevel.CHAIN:
            return [CrudApi.Role.superuser, CrudApi.Role.chainadmin].includes(
              role || CrudApi.Role.inactive,
            );
          case EProductLevel.GROUP:
            return [
              CrudApi.Role.superuser,
              CrudApi.Role.chainadmin,
              CrudApi.Role.groupadmin,
            ].includes(role || CrudApi.Role.inactive);
          case EProductLevel.UNIT:
            return [
              CrudApi.Role.superuser,
              CrudApi.Role.chainadmin,
              CrudApi.Role.groupadmin,
              CrudApi.Role.unitadmin,
            ].includes(role || CrudApi.Role.inactive);
          default:
            return true;
        }
      }),
    );
    */
  }

  public chainProducts$() {
    return this._chainProductCollectionService.filteredEntities$.pipe(
      switchMap((chainProducts: CrudApi.ChainProduct[]) => {
        const [dirtyChainProducts, cleanChainProducts] = partition(
          p => p.dirty,
          chainProducts,
        );

        return of([...cleanChainProducts, ...dirtyChainProducts]);
      }),
    );
  }

  public groupProducts$(searchValueChanges: Observable<string>) {
    return combineLatest([
      searchValueChanges.pipe(debounceTime(200), startWith('')),
      this._store.select(
        productsSelectors.getExtendedGroupProductsOfSelectedCategory,
      ),
      this._store.select(
        productsSelectors.getPendingGroupProductsOfSelectedCategory,
      ),
    ]).pipe(
      switchMap(([searchValue, groupProducts, pendingGroupProducts]) => {
        const [dirtyGroupProducts, cleanGroupProducts] = partition(
          p => p.dirty,
          groupProducts,
        );

        return of(
          [
            ...pendingGroupProducts.map(p => ({ ...p, pending: true })),
            ...cleanGroupProducts,
            ...dirtyGroupProducts,
          ].filter(p => foundIn(searchValue, p)),
        );
      }),
    );
  }

  public unitProducts$(searchValueChanges: Observable<string>) {
    return combineLatest([
      searchValueChanges.pipe(debounceTime(200), startWith('')),
      this._store
        .select(productsSelectors.getExtendedUnitProductsOfSelectedCategory)
        .pipe(map(products => products.sort(customNumberCompare('position')))),
      this._store.select(
        productsSelectors.getPendingUnitProductsOfSelectedCategory,
      ),
    ]).pipe(
      switchMap(([searchValue, unitProducts, pendingUnitProducts]) => {
        const [dirtyUnitProducts, cleanUnitProducts] = partition(
          p => p.dirty,
          unitProducts,
        );

        return of(
          [
            ...pendingUnitProducts.map(p => ({ ...p, pending: true })),
            ...cleanUnitProducts,
            ...dirtyUnitProducts,
          ].filter(p => foundIn(searchValue, p)),
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
    return combineLatest([
      this._chainProductCollectionService.loading$,
      this._groupProductCollectionService.loading$,
      this._unitProductCollectionService.loading$,
    ]).pipe(
      switchMap(([chainsLoading, groupsLoading, unitsLoading]) =>
        of(chainsLoading || groupsLoading || unitsLoading),
      ),
    );
  }

  public updateLocalizedItemSearchValue(searchValue: string) {
    this._chainProductCollectionService.setCurrentLocalizedItemFilter(
      'name',
      searchValue,
    );

    this._groupProductCollectionService.setCurrentLocalizedItemFilter(
      'name',
      searchValue,
    );

    this._unitProductCollectionService.setCurrentLocalizedItemFilter(
      'name',
      searchValue,
    );
  }

  public resetNextTokens() {
    this._nextToken = { ...INITIAL_TOKENS };
  }

  public loadNextChainProductPaginatedData() {
    if (!this._working.chain) {
      this._working.chain = true;

      this._store
        .select(loggedUserSelectors.getLoggedUserSettings)
        .pipe(
          filter(settings => !!settings),
          take(1),
          switchMap(settings =>
            iif(
              () =>
                !!settings?.selectedChainId &&
                !!settings?.selectedProductCategoryId,
              this._chainProductCollectionService
                .getCachedPaginatedData$({
                  filter: {
                    chainId: { eq: settings?.selectedChainId },
                    deletedAt: { exists: false },
                    productCategoryId: {
                      eq: settings?.selectedProductCategoryId,
                    },
                  },
                  limit: PAGINATION_LIMIT,
                  nextToken: this._nextToken.chain,
                })
                .pipe(
                  // Load groupProducts
                  switchMap(chainListResult =>
                    from(chainListResult.items.map(i => i.id)).pipe(
                      filterNullish(),
                      mergeMap(chainProductId =>
                        this._groupProductCollectionService
                          .getCachedPaginatedData$(
                            {
                              filter: {
                                chainId: { eq: settings?.selectedChainId },
                                groupId: { eq: settings?.selectedGroupId },
                                deletedAt: { exists: false },
                                parentId: {
                                  eq: chainProductId,
                                },
                              },
                            },
                            false,
                          )
                          .pipe(
                            map(res => res.items[0]),
                            filterNullish(),
                            take(1),
                          ),
                      ),
                      toArray(),
                      tap(groupProducts => {
                        this._groupProductCollectionService.addManyToCache(
                          groupProducts,
                        );
                      }),
                      // Load unitProducts
                      switchMap(groupListResult =>
                        from(groupListResult.map(i => i.id)).pipe(
                          filterNullish(),
                          mergeMap(groupProductId =>
                            this._unitProductCollectionService
                              .getCachedPaginatedData$(
                                {
                                  filter: {
                                    chainId: { eq: settings?.selectedChainId },
                                    groupId: { eq: settings?.selectedGroupId },
                                    unitId: { eq: settings?.selectedUnitId },
                                    deletedAt: { exists: false },
                                    parentId: {
                                      eq: groupProductId,
                                    },
                                  },
                                },
                                false,
                              )
                              .pipe(
                                map(res => res.items[0]),
                                filterNullish(),
                                take(1),
                              ),
                          ),
                          toArray(),
                          tap(unitProducts => {
                            this._unitProductCollectionService.addManyToCache(
                              unitProducts,
                            );
                          }),
                        ),
                      ),
                      mapTo(chainListResult),
                    ),
                  ),
                ),
              of(undefined),
            ),
          ),
          take(1),
        )
        .subscribe(result => {
          this._nextToken.chain = result?.nextToken || undefined;
          this._working.chain = false;
        });
    }
  }

  public loadNextGroupProductPaginatedData() {
    if (!this._working.group) {
      this._working.group = true;

      this._store
        .select(loggedUserSelectors.getLoggedUserSettings)
        .pipe(
          filter(settings => !!settings),
          take(1),
          switchMap(settings =>
            iif(
              () => !!settings?.selectedChainId && !!settings?.selectedGroupId,
              this._groupProductCollectionService
                .getCachedPaginatedData$({
                  filter: {
                    chainId: { eq: settings?.selectedChainId },
                    groupId: { eq: settings?.selectedGroupId },
                    deletedAt: { exists: false },
                  },
                  limit: PAGINATION_LIMIT,
                  nextToken: this._nextToken.group,
                })
                .pipe(
                  // Load unitProducts
                  switchMap(groupListResult =>
                    from(groupListResult.items.map(i => i.id)).pipe(
                      filterNullish(),
                      mergeMap(groupProductId =>
                        this._unitProductCollectionService
                          .getCachedPaginatedData$(
                            {
                              filter: {
                                chainId: { eq: settings?.selectedChainId },
                                groupId: { eq: settings?.selectedGroupId },
                                unitId: { eq: settings?.selectedUnitId },
                                deletedAt: { exists: false },
                                parentId: {
                                  eq: groupProductId,
                                },
                              },
                            },
                            false,
                          )
                          .pipe(
                            map(res => res.items[0]),
                            filterNullish(),
                            take(1),
                          ),
                      ),
                      toArray(),
                      tap(unitProducts =>
                        this._unitProductCollectionService.addManyToCache(
                          unitProducts,
                        ),
                      ),
                      // Load chainProducts
                      switchMap(() =>
                        from(groupListResult.items.map(i => i.parentId)).pipe(
                          filterNullish(),
                          mergeMap(chainProductId =>
                            this._chainProductCollectionService
                              .getCachedPaginatedData$(
                                {
                                  filter: {
                                    chainId: { eq: settings?.selectedChainId },
                                    deletedAt: { exists: false },
                                    id: {
                                      eq: chainProductId,
                                    },
                                  },
                                },
                                false,
                              )
                              .pipe(
                                map(res => res.items[0]),
                                filterNullish(),
                                take(1),
                              ),
                          ),
                          toArray(),
                          tap(chainProducts =>
                            this._chainProductCollectionService.addManyToCache(
                              chainProducts,
                            ),
                          ),
                        ),
                      ),
                      mapTo(groupListResult),
                    ),
                  ),
                ),
              of(undefined),
            ),
          ),
          take(1),
        )
        .subscribe(result => {
          this._nextToken.group = result?.nextToken || undefined;
          this._working.group = false;
        });
    }
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
              () =>
                !!settings?.selectedChainId &&
                !!settings?.selectedGroupId &&
                !!settings?.selectedUnitId,
              this._unitProductCollectionService
                .getCachedPaginatedData$({
                  filter: {
                    chainId: { eq: settings?.selectedChainId },
                    groupId: { eq: settings?.selectedGroupId },
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
                      mergeMap(groupProductId =>
                        this._groupProductCollectionService
                          .getCachedPaginatedData$(
                            {
                              filter: {
                                chainId: { eq: settings?.selectedChainId },
                                groupId: { eq: settings?.selectedGroupId },
                                deletedAt: { exists: false },
                                id: {
                                  eq: groupProductId,
                                },
                              },
                            },
                            false,
                          )
                          .pipe(
                            map(res => res.items[0]),
                            filterNullish(),
                            take(1),
                          ),
                      ),
                      toArray(),
                      tap(groupProducts => {
                        this._groupProductCollectionService.addManyToCache(
                          groupProducts,
                        );
                      }),
                      // Load chainProducts
                      switchMap(groupListResult =>
                        from(groupListResult.map(i => i.parentId)).pipe(
                          filterNullish(),
                          mergeMap(chainProductId =>
                            this._chainProductCollectionService
                              .getCachedPaginatedData$(
                                {
                                  filter: {
                                    chainId: { eq: settings?.selectedChainId },
                                    deletedAt: { exists: false },
                                    productCategoryId: {
                                      eq: settings?.selectedProductCategoryId,
                                    },
                                    id: {
                                      eq: chainProductId,
                                    },
                                  },
                                },
                                false,
                              )
                              .pipe(
                                map(res => res.items[0]),
                                filterNullish(),
                                take(1),
                              ),
                          ),
                          toArray(),
                          tap(chainProducts => {
                            this._chainProductCollectionService.addManyToCache(
                              chainProducts,
                            );
                          }),
                        ),
                      ),
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

  public deleteChainProduct(id: string) {
    const childCheck$ = this._crudSdk.sdk.SearchGroupProducts({
      filter: {
        parentId: { eq: id },
        deletedAt: { exists: false },
      },
    });

    this._acceptDeletion$(childCheck$)
      .pipe(
        switchMap(accepted =>
          iif(
            () => accepted,
            defer(() =>
              this._crudSdk.sdk.UpdateChainProduct({
                input: { id, deletedAt: new Date().toISOString() },
              }),
            ).pipe(
              filterNullish(),
              tap(product => {
                this._chainProductCollectionService.removeOneFromCache(product);
              }),
            ),
            of(undefined),
          ),
        ),
        take(1),
      )
      .subscribe();
  }

  public deleteGroupProduct(id: string) {
    const childCheck$ = this._crudSdk.sdk.SearchUnitProducts({
      filter: {
        parentId: { eq: id },
        deletedAt: { exists: false },
      },
    });

    this._acceptDeletion$(childCheck$)
      .pipe(
        switchMap(accepted =>
          iif(
            () => accepted,
            defer(() =>
              this._crudSdk.sdk.UpdateGroupProduct({
                input: { id, deletedAt: new Date().toISOString() },
              }),
            ).pipe(
              filterNullish(),
              tap(product => {
                this._groupProductCollectionService.removeOneFromCache(product);
              }),
            ),
            of(undefined),
          ),
        ),
        take(1),
      )
      .subscribe();
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
