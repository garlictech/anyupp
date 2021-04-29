import { map } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import {
  IProductCategory,
  IProductCategoryOrderChangeEvent,
} from '@bgap/shared/types';
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
  public productCategories: IProductCategory[] = [];
  private _sortedProductCategoryIds: string[] = [];

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _nbDialogService: NbDialogService,
    private _amplifyDataService: AmplifyDataService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this._store
      .pipe(
        select(productCategoriesSelectors.getAllProductCategories),
        map((products): IProductCategory[] =>
          products.sort(customNumberCompare('position')),
        ),
        untilDestroyed(this),
      )
      .subscribe((productCategories: IProductCategory[]): void => {
        this.productCategories = productCategories;
        this._sortedProductCategoryIds = this.productCategories.map(p => p.id);

        this._changeDetectorRef.detectChanges();
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
        async (productCategoryId: string, pos: number): Promise<void> => {
          await this._amplifyDataService.update<IProductCategory>(
            'getProductCategory',
            'updateProductCategory',
            productCategoryId,
            (data: unknown) => ({
              ...(<IProductCategory>data),
              position: pos + 1,
            }),
          );
        },
      );
    }

    this._changeDetectorRef.detectChanges();
  }
}
