import { map } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { customNumberCompare } from '@bgap/shared/utils';
import {
  IProductCategory,
  IProductCategoryOrderChangeEvent,
} from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { ProductCategoryFormComponent } from '../product-category-form/product-category-form.component';

@UntilDestroy()
@Component({
  selector: 'bgap-product-category-list',
  templateUrl: './product-category-list.component.html',
})
export class ProductCategoryListComponent implements OnInit, OnDestroy {
  public productCategories: IProductCategory[] = [];
  private _sortedProductCategoryIds: string[] = [];
  private _selectedChainId?: string | undefined | null;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _nbDialogService: NbDialogService,
    private _dataService: DataService
  ) {}

  ngOnInit(): void {
    this._store
      .pipe(
        select(productCategoriesSelectors.getAllProductCategories),
        map((products): IProductCategory[] =>
          products.sort(customNumberCompare('position'))
        ),
        untilDestroyed(this)
      )
      .subscribe((productCategories: IProductCategory[]): void => {
        this.productCategories = productCategories;
        this._sortedProductCategoryIds = this.productCategories.map(
          (p): string => p._id
        );
      });

    this._store
      .pipe(
        select(loggedUserSelectors.getSelectedChainId),
        untilDestroyed(this)
      )
      .subscribe((selectedChainId: string | undefined | null): void => {
        this._selectedChainId = selectedChainId;
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addProductCategory(): void {
    this._nbDialogService.open(ProductCategoryFormComponent, {
      hasBackdrop: true,
      closeOnBackdropClick: false,
      hasScroll: true,
      dialogClass: 'form-dialog',
    });
  }

  public positionChange($event: IProductCategoryOrderChangeEvent): void {
    const idx = this._sortedProductCategoryIds.indexOf(
      $event.productCategoryId
    );

    if (
      (idx >= 0 &&
        $event.change === 1 &&
        idx < this._sortedProductCategoryIds.length - 1) ||
      ($event.change === -1 && idx > 0)
    ) {
      this._sortedProductCategoryIds.splice(idx, 1);
      this._sortedProductCategoryIds.splice(
        idx + $event.change,
        0,
        $event.productCategoryId
      );

      this._sortedProductCategoryIds.forEach(
        (productCategoryId: string, pos: number): void => {
          this._dataService.updateProductCategoryPosition(
            this._selectedChainId || '',
            productCategoryId,
            (pos + 1).toString()
          );
        }
      );
    }
  }
}
