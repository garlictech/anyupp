import { combineLatest, Observable } from 'rxjs';
import { map, tap } from 'rxjs/operators';

import { CdkVirtualScrollViewport } from '@angular/cdk/scrolling';
import { ChangeDetectionStrategy, Component, ViewChild } from '@angular/core';
import { Chain, ProductCategory } from '@bgap/domain';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { CdkDragDrop } from '@angular/cdk/drag-drop';
import { externalIdArrayCompare } from '@bgap/shared/utils';
import { Store } from '@ngrx/store';
import { visibleLinesOnViewport } from '../../../../shared/utils';
import { chainsSelectors } from '../../../../store/chains';
import { ProductCategoryCollectionService } from '../../../../store/product-categories';
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

  public productCategories$: Observable<ProductCategory[]>;
  public sortedProductCategoryIds: string[] = [];

  private _selectedChainId?: string;
  public chain?: Chain;

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
    private _productCategoryListService: ProductCategoryListService,
    private _productCategoryCollectionService: ProductCategoryCollectionService,
  ) {
    this.productCategories$ = combineLatest([
      this._store.select(chainsSelectors.getSelectedChain),
      this._productCategoryCollectionService.filteredEntities$,
    ]).pipe(
      tap(([chain]) => {
        this._selectedChainId = chain?.id;
        this.chain = chain;
      }),
      map(([chain, productCategories]): ProductCategory[] => [
        ...productCategories.sort(
          externalIdArrayCompare((chain?.categoryOrders || []) as string[]),
        ),
      ]),
      tap(productCategories => {
        this.sortedProductCategoryIds = productCategories.map(p => p.id);
      }),
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

  drop(event: CdkDragDrop<string[]>) {
    const element = this.sortedProductCategoryIds.splice(
      event.previousIndex,
      1,
    )[0];

    this.sortedProductCategoryIds.splice(event.currentIndex, 0, element);

    this._productCategoryListService
      .updateProductCategoryOrders$(
        this._selectedChainId || '',
        this.sortedProductCategoryIds,
      )
      .subscribe();
  }
}
