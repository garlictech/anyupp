/* eslint-disable @typescript-eslint/no-explicit-any */
import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';

import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Chain, Maybe, NestedSortItem, ProductCategory } from '@bgap/domain';
import { externalIdArrayCompare } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import {
  ToasterService,
  visibleLinesOnViewport,
} from '../../../../shared/utils';
import { chainsSelectors } from '../../../../store/chains';
import { ProductCategoryCollectionService } from '../../../../store/product-categories';
import { ProductCategoryListService } from '../../services/product-category-list.service';
import { ProductCategoryFormComponent } from '../product-category-form/product-category-form.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-category-list',
  templateUrl: './product-category-list.component.html',
  styleUrls: ['./product-category-list.component.scss'],
})
export class ProductCategoryListComponent {
  @ViewChild('dataVSVP')
  dataVSVP?: CdkVirtualScrollViewport;

  public productCategories$: Observable<ProductCategory[]>;
  public sortedProductCategoryIds: string[] = [];
  public chain?: Chain;
  public categoryOrders: Maybe<NestedSortItem>[] = [];
  public flatNodes: NestedSortItem[] = [];
  public enableSaveSorting = false;

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
    private _productCategoryListService: ProductCategoryListService,
    private _productCategoryCollectionService: ProductCategoryCollectionService,
    private _toasterService: ToasterService,
  ) {
    this.productCategories$ = combineLatest([
      this._store.select(chainsSelectors.getSelectedChain),
      this._productCategoryCollectionService.filteredEntities$,
    ]).pipe(
      tap(([chain, productCategories]) => {
        this.chain = chain;

        // Check the missing ids (e.g. new category saved which is not sorted yet)
        this.categoryOrders = chain?.categoryOrders || [];
        const categoryOrderedIds = this.categoryOrders.map(co => co?.id);
        const missingCategories = productCategories.filter(
          cat => !categoryOrderedIds?.includes(cat.id),
        );

        this.categoryOrders = this.categoryOrders.concat(
          missingCategories.map(c => ({ id: c.id })),
        );

        this.enableSaveSorting = missingCategories.length > 0;
      }),
      map(([chain, productCategories]): ProductCategory[] => [
        ...productCategories.sort(
          externalIdArrayCompare(
            (chain?.categoryOrders || []).map(o => o?.id) as string[],
          ),
        ),
      ]),

      untilDestroyed(this),
    );
  }

  public addProductCategory() {
    this._nbDialogService.open(ProductCategoryFormComponent);
  }

  public loadNextPaginatedData(count: number, itemCount: number) {
    if (
      itemCount - count <
      visibleLinesOnViewport(this.dataVSVP?.elementRef.nativeElement)
    ) {
      this._productCategoryListService.loadNextPaginatedData();
    }
  }

  public onNodeDrop(flatNodes: NestedSortItem[]) {
    this.flatNodes = flatNodes;
    this.enableSaveSorting = true;
  }

  public saveSorting() {
    this._productCategoryListService
      .updateProductCategoryOrders$(this.chain?.id || '', this.flatNodes)
      .subscribe(() => {
        this._toasterService.showSimpleSuccess('update');
      });
  }
}
