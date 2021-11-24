import { combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import * as CrudApi from '@bgap/crud-gql/api';
import { ProductCategoryOrderChangeEvent } from '@bgap/shared/types';
import { customNumberCompare } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { ProductCategoryListService } from '../../services/product-category-list.service';
import { ProductCategoryFormComponent } from '../product-category-form/product-category-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-category-list',
  templateUrl: './product-category-list.component.html',
})
export class ProductCategoryListComponent implements OnInit, OnDestroy {
  public productCategories: CrudApi.ProductCategory[] = [];
  private _sortedProductCategoryIds: string[] = [];

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _productCategoryListService: ProductCategoryListService,
  ) {}

  ngOnInit(): void {
    this._store
      .pipe(
        select(productCategoriesSelectors.getAllProductCategories),
        map((products): CrudApi.ProductCategory[] =>
          products.sort(customNumberCompare('position')),
        ),
        untilDestroyed(this),
      )
      .subscribe((productCategories: CrudApi.ProductCategory[]): void => {
        this.productCategories = productCategories;
        this._sortedProductCategoryIds = this.productCategories.map(p => p.id);

        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addProductCategory(): void {
    this._nbDialogService.open(ProductCategoryFormComponent);
  }

  public positionChange($event: ProductCategoryOrderChangeEvent): void {
    const itemIdx = this._sortedProductCategoryIds.indexOf(
      $event.productCategoryId,
    );

    if (
      (itemIdx >= 0 &&
        $event.change === 1 &&
        itemIdx < this._sortedProductCategoryIds.length - 1) ||
      ($event.change === -1 && itemIdx > 0)
    ) {
      const neighbourId =
        this._sortedProductCategoryIds[itemIdx + $event.change];

      combineLatest([
        this._productCategoryListService.updateUnitProductCategoryPosition$(
          $event.productCategoryId,
          itemIdx + 1 + $event.change,
        ),
        this._productCategoryListService.updateUnitProductCategoryPosition$(
          neighbourId,
          itemIdx + 1,
        ),
      ]).subscribe();
    }

    this._changeDetectorRef.detectChanges();
  }
}
