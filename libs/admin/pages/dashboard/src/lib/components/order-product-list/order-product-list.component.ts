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
import { dashboardSelectors } from '@bgap/admin/store/dashboard';
import { groupsSelectors } from '@bgap/admin/store/groups';
import { ProductCategoryCollectionService } from '@bgap/admin/store/product-categories';
import { GeneratedProductCollectionService } from '@bgap/admin/store/products';
import { EDashboardSize, ENebularButtonSize } from '@bgap/shared/types';
import * as CrudApi from '@bgap/crud-gql/api';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';
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
    private _productCategoryCollectionService: ProductCategoryCollectionService,
    private _generatedProductCollectionService: GeneratedProductCollectionService,
  ) {
    this.generatedUnitProducts = [];
  }

  ngOnInit() {
    this._store
      .select(groupsSelectors.getSeletedGroup)
      .pipe(
        skipWhile((group): boolean => !group),
        untilDestroyed(this),
      )
      .subscribe((group: CrudApi.Group | undefined): void => {
        this.groupCurrency = group?.currency || '';

        this._changeDetectorRef.detectChanges();
      });

    this._store
      .select(dashboardSelectors.getSize)
      .pipe(untilDestroyed(this))
      .subscribe((size: EDashboardSize): void => {
        this.buttonSize =
          size === EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;

        this._changeDetectorRef.detectChanges();
      });

    combineLatest([
      this._productCategoryCollectionService.filteredEntities$,
      this._generatedProductCollectionService.filteredEntities$,
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([productCategories, generatedUnitProducts]): void => {
        this.generatedUnitProducts = generatedUnitProducts;

        this.productCategories = productCategories.filter(
          (category: ProductCategory) =>
            this.generatedUnitProducts.filter(
              p => p.productCategoryId === category.id,
            ).length > 0,
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
        await this._orderService.updateOrderItemStatus$(
          (<CrudApi.Order>this.selectedOrder).id,
          CrudApi.OrderStatus.placed,
          <number>existingVariantOrderIdx,
        ).toPromise();
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
