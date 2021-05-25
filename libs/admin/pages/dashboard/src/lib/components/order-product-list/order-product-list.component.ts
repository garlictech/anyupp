import { combineLatest } from 'rxjs';
import { skipWhile } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { dashboardSelectors } from '@bgap/admin/shared/data-access/dashboard';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import { EDashboardSize, ENebularButtonSize } from '@bgap/shared/types';
import * as CrudApi from '@bgap/crud-gql/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { ProductCategory } from '@bgap/crud-gql/api';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-product-list',
  templateUrl: './order-product-list.component.html',
  styleUrls: ['./order-product-list.component.scss'],
})
export class OrderProductListComponent implements OnInit, OnDestroy {
  @Input() selectedOrder?: CrudApi.Order;
  public generatedUnitProducts: CrudApi.GeneratedProduct[];
  public productCategories: ProductCategory[] = [];
  public selectedProductCategoryId = '';
  public groupCurrency = '';
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;

  constructor(
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.generatedUnitProducts = [];
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(groupsSelectors.getSeletedGroup),
        skipWhile((group): boolean => !group),
      )
      .subscribe((group: CrudApi.Group | undefined): void => {
        this.groupCurrency = group?.currency || '';

        this._changeDetectorRef.detectChanges();
      });

    this._store
      .pipe(select(dashboardSelectors.getSize), untilDestroyed(this))
      .subscribe((size: EDashboardSize): void => {
        this.buttonSize =
          size === EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;

        this._changeDetectorRef.detectChanges();
      });

    combineLatest([
      this._store.pipe(
        select(productCategoriesSelectors.getAllProductCategories),
        untilDestroyed(this),
      ),
      this._store.pipe(
        select(productsSelectors.getAllGeneratedUnitProducts),
        untilDestroyed(this),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([productCategories, generatedUnitProducts]): void => {
        this.generatedUnitProducts = generatedUnitProducts;

        this.productCategories = productCategories.filter(
          (category: ProductCategory): boolean => {
            return (
              this.generatedUnitProducts.filter(
                p => p.productCategoryId === category.id,
              ).length > 0
            );
          },
        );

        this.selectedProductCategoryId = this.productCategories?.[0]?.id;

        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public onProductCategorySelected(productCategoryId: string): void {
    this.selectedProductCategoryId = productCategoryId;
  }

  public addProductVariant(
    product: CrudApi.GeneratedProduct,
    variantId: string,
  ): void {
    console.error('TODO addProductVariant', product, variantId);
    /* TODO variant object refactor
    const existingVariantOrderIdx = this.selectedOrder?.items.findIndex(
      (orderItem: CrudApi.OrderItem): boolean =>
        orderItem.productId === product.id &&
        orderItem.variantId === variantId &&
        orderItem.priceShown.pricePerUnit === product.variants[variantId].price,
    );


    if ((existingVariantOrderIdx || 0) >= 0) {
      this._orderService.updateQuantity(
        fp.cloneDeep(<CrudApi.Order>this.selectedOrder),
        <number>existingVariantOrderIdx,
        1,
      );

      if (
        currentStatus(
          (<CrudApi.Order>this.selectedOrder).items[<number>existingVariantOrderIdx]
            .statusLog,
        ) === CrudApi.OrderStatus.REJECTED
      ) {
        this._orderService.updateOrderItemStatus(
          (<CrudApi.Order>this.selectedOrder).id,
          CrudApi.OrderStatus.placed,
          <number>existingVariantOrderIdx,
        );
      }
    } else {
      this._orderService.addProductVariant(
        fp.cloneDeep(<CrudApi.Order>this.selectedOrder),
        product,
        variantId,
      );
    }
    */
  }
}
