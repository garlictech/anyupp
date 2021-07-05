import { map } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { catchGqlError } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { IProductCategoryOrderChangeEvent } from '@bgap/shared/types';
import { customNumberCompare } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

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
    private _crudSdk: CrudSdkService,
    private _changeDetectorRef: ChangeDetectorRef,
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

  public positionChange($event: IProductCategoryOrderChangeEvent): void {
    const idx = this._sortedProductCategoryIds.indexOf(
      $event.productCategoryId,
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
        $event.productCategoryId,
      );

      this._sortedProductCategoryIds.forEach(
        (productCategoryId: string, pos: number) => {
          this._crudSdk.sdk
            .UpdateProductCategory({
              input: {
                id: productCategoryId,
                position: pos + 1,
              },
            })
            .pipe(catchGqlError(this._store))
            .subscribe();
        },
      );
    }

    this._changeDetectorRef.detectChanges();
  }
}
