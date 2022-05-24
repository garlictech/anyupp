import { Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ViewChild,
} from '@angular/core';
import { visibleLinesOnViewport } from '../../../../shared/utils';
import { ProductCategoryCollectionService } from '../../../../store/product-categories';
import * as CrudApi from '@bgap/crud-gql/api';
import { ProductCategoryOrderChangeEvent } from '@bgap/shared/types';
import { customNumberCompare } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';

import { ProductCategoryListService } from '../../services/product-category-list.service';
import { ProductCategoryFormComponent } from '../product-category-form/product-category-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-category-list',
  templateUrl: './product-category-list.component.html',
})
export class ProductCategoryListComponent {
  @ViewChild('dataVSVP')
  dataVSVP?: CdkVirtualScrollViewport;

  public productCategories$: Observable<CrudApi.ProductCategory[]>;
  private _sortedProductCategoryIds: string[] = [];

  constructor(
    private _nbDialogService: NbDialogService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _productCategoryListService: ProductCategoryListService,
    private _productCategoryCollectionService: ProductCategoryCollectionService,
  ) {
    this.productCategories$ =
      this._productCategoryCollectionService.filteredEntities$.pipe(
        map((products): CrudApi.ProductCategory[] =>
          products.sort(customNumberCompare('position')),
        ),
        tap(productCategories => {
          this._sortedProductCategoryIds = productCategories.map(p => p.id);
        }),
      );
  }

  public addProductCategory() {
    this._nbDialogService.open(ProductCategoryFormComponent);
  }

  public positionChange($event: ProductCategoryOrderChangeEvent) {
    this._productCategoryListService
      .positionChange($event, this._sortedProductCategoryIds)
      .subscribe();

    this._changeDetectorRef.detectChanges();
  }

  public loadNextPaginatedData(count: number, itemCount: number) {
    if (
      itemCount - count <
      visibleLinesOnViewport(this.dataVSVP?.elementRef.nativeElement)
    ) {
      this._productCategoryListService.loadNextPaginatedData();
    }
  }
}
