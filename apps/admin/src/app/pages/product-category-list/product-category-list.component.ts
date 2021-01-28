import { map } from 'rxjs/operators';

import { Component, OnDestroy, OnInit } from '@angular/core';
import { IProductCategory, IProductCategoryOrderChangeEvent } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { customNumberCompare } from '../../shared/pure';
import { DataService } from '../../shared/services/data';
import { IState } from '../../store';
import { currentUserSelectors, productCategoryListSelectors } from '../../store/selectors';
import { ProductCategoryFormComponent } from './components/product-category-form/product-category-form.component';

@UntilDestroy()
@Component({
  selector: 'bgap-product-category-list',
  templateUrl: './product-category-list.component.html',
})
export class ProductCategoryListComponent implements OnInit, OnDestroy {
  public productCategories: IProductCategory[];
  private _sortedProductCategoryIds: string[];
  private _selectedChainId: string;

  constructor(
    private _store: Store<IState>,
    private _nbDialogService: NbDialogService,
    private _dataService: DataService
  ) {}

  ngOnInit(): void {
    this._store
      .pipe(
        select(productCategoryListSelectors.getAllProductCategories),
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
        select(currentUserSelectors.getSelectedChainId),
        untilDestroyed(this)
      )
      .subscribe((selectedChainId: string): void => {
        this._selectedChainId = selectedChainId;
      });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
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
            this._selectedChainId,
            productCategoryId,
            (pos + 1).toString()
          );
        }
      );
    }
  }
}
