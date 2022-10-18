import { combineLatest } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { ProductCategory, UnitProduct } from '@bgap/crud-gql/api';
import { Order } from '@bgap/domain';
import { EDashboardSize, ENebularButtonSize } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { dashboardSelectors } from '../../../../store/dashboard';
import { ProductCategoryCollectionService } from '../../../../store/product-categories';
import { UnitProductCollectionService } from '../../../../store/products';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-product-list',
  templateUrl: './order-product-list.component.html',
  styleUrls: ['./order-product-list.component.scss'],
})
export class OrderProductListComponent implements OnInit {
  @Input() selectedOrder?: Order;
  public unitProducts: UnitProduct[];
  public productCategories: ProductCategory[] = [];
  public selectedProductCategoryId = '';
  public groupCurrency = '';
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;

  constructor(
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
    private _productCategoryCollectionService: ProductCategoryCollectionService,
    private _unitProductCollectionService: UnitProductCollectionService,
  ) {
    this.unitProducts = [];
  }

  ngOnInit() {
    this._store
      .select(dashboardSelectors.getSize)
      .pipe(untilDestroyed(this))
      .subscribe((size: EDashboardSize) => {
        this.buttonSize =
          size === EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;

        this._changeDetectorRef.detectChanges();
      });

    combineLatest([
      this._productCategoryCollectionService.filteredEntities$,
      this._unitProductCollectionService.filteredEntities$,
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([productCategories, unitProducts]) => {
        this.unitProducts = unitProducts;

        this.productCategories = productCategories.filter(
          (category: ProductCategory) =>
            this.unitProducts.filter(p => p.productCategoryId === category.id)
              .length > 0,
        );

        this.selectedProductCategoryId = this.productCategories?.[0]?.id;

        this._changeDetectorRef.detectChanges();
      });
  }

  public onProductCategorySelected(productCategoryId: string) {
    this.selectedProductCategoryId = productCategoryId;
  }

  public addProductVariant(product: UnitProduct, variantId: string) {
    console.error('TODO addProductVariant', product, variantId);
    /* TODO variant object refactor
    const existingVariantOrderIdx = this.selectedOrder?.items.findIndex(
      (orderItem: OrderItem): boolean =>
        orderItem.productId === product.id &&
        orderItem.variantId === variantId &&
        orderItem.priceShown.pricePerUnit === product.variants[variantId].price,
    );


    if ((existingVariantOrderIdx || 0) >= 0) {
      this._orderService.updateQuantity(
        fp.cloneDeep(<Order>this.selectedOrder),
        <number>existingVariantOrderIdx,
        1,
      );

      if (
        currentStatus(
          (<Order>this.selectedOrder).items[<number>existingVariantOrderIdx]
            .statusLog,
        ) === OrderStatus.REJECTED
      ) {
        await this._orderService.updateOrderItemStatus$(
          (<Order>this.selectedOrder).id,
          OrderStatus.placed,
          <number>existingVariantOrderIdx,
        ).toPromise();
      }
    } else {
      this._orderService.addProductVariant(
        fp.cloneDeep(<Order>this.selectedOrder),
        product,
        variantId,
      );
    }
    */
  }
}
