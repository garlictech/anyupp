import { combineLatest, defer, iif, Observable, of } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { ConfirmDialogComponent } from '../../../shared/components';
import { PAGINATION_LIMIT } from '../../../shared/data-access/ngrx-data';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { loggedUserSelectors } from '../../../store/logged-user';
import { ProductComponentSetCollectionService } from '../../../store/product-component-sets';
import { ProductComponentCollectionService } from '../../../store/product-components';
import { filterNullish } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
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
  private _selectedUnitId?: string | null;

  constructor(
    private _store: Store,
    private _productComponentCollectionService: ProductComponentCollectionService,
    private _productComponentSetCollectionService: ProductComponentSetCollectionService,
    private _nbDialogService: NbDialogService,
    private _crudSdk: CrudSdkService,
  ) {
    this._store
      .select(loggedUserSelectors.getSelectedUnitId)
      .subscribe(selectedUnitId => {
        this._selectedUnitId = selectedUnitId;
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
            chainId: { eq: this._selectedUnitId },
            deletedAt: { exists: false },
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
            chainId: { eq: this._selectedUnitId },
            deletedAt: { exists: false },
          },
        })
        .subscribe(result => {
          this._nextToken.componentSet = result?.nextToken || undefined;
          this._working.componentSet = false;
        });
    }
  }

  public deleteProductComponent(id: string) {
    // no childcheck
    this._acceptDeletion$('productComponents.confirmDeleteProductComponent')
      .pipe(
        switchMap(accepted =>
          iif(
            () => accepted,
            defer(() =>
              this._crudSdk.sdk.UpdateProductComponent({
                input: { id, deletedAt: new Date().toISOString() },
              }),
            ).pipe(
              filterNullish(),
              tap(productComponent => {
                this._productComponentCollectionService.removeOneFromCache(
                  productComponent,
                );
              }),
            ),
            of(undefined),
          ),
        ),
        take(1),
      )
      .subscribe();
  }

  public deleteProductComponentSet(id: string) {
    // no childcheck
    this._acceptDeletion$(
      'productComponentSets.confirmDeleteProductComponentSet',
    )
      .pipe(
        switchMap(accepted =>
          iif(
            () => accepted,
            defer(() =>
              this._crudSdk.sdk.UpdateProductComponentSet({
                input: { id, deletedAt: new Date().toISOString() },
              }),
            ).pipe(
              filterNullish(),
              tap(productComponentSet => {
                this._productComponentSetCollectionService.removeOneFromCache(
                  productComponentSet,
                );
              }),
            ),
            of(undefined),
          ),
        ),
        take(1),
      )
      .subscribe();
  }

  private _acceptDeletion$(message: string) {
    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    return new Observable<boolean>(observer => {
      dialog.componentRef.instance.options = {
        message,
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
    });
  }
}
