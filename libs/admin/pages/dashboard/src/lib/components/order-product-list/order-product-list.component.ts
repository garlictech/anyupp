import { combineLatest } from 'rxjs';
import { skipWhile } from 'rxjs/operators';

import { Component, Input } from '@angular/core';
import { dashboardSelectors } from '@bgap/admin/shared/data-access/dashboard';
import { OrderService } from '@bgap/admin/shared/data-access/data';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import {
  EDashboardSize, ENebularButtonSize, IGeneratedProduct, IGroup, IOrder, IProduct,
  IProductCategory
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-order-product-list',
  templateUrl: './order-product-list.component.html',
  styleUrls: ['./order-product-list.component.scss'],
})
export class OrderProductListComponent {
  @Input() selectedOrder?: IOrder;
  public generatedUnitProducts: IGeneratedProduct[];
  public productCategories: IProductCategory[] = [];
  public selectedProductCategoryId = '';
  public groupCurrency = '';
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>, private _orderService: OrderService) {
    this.generatedUnitProducts = [];

    this._store
      .pipe(
        select(groupsSelectors.getSeletedGroup),
        skipWhile((group): boolean => !group),
      )
      .subscribe((group: IGroup | undefined): void => {
        this.groupCurrency = group?.currency || '';
      });

    this._store
      .pipe(select(dashboardSelectors.getSize), untilDestroyed(this))
      .subscribe((size: EDashboardSize): void => {
        this.buttonSize =
          size === EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;
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
      .subscribe(
        ([productCategories, generatedUnitProducts]: [
          IProductCategory[],
          IProduct[],
        ]): void => {
          this.generatedUnitProducts = generatedUnitProducts;

          /* TODO fix - remove?
          this.generatedUnitProducts.forEach((p: IGeneratedProduct) => {
            p._variants_arr = <IProductVariant[]>objectToArray(p.variants);
          });
          */

          this.productCategories = productCategories.filter(
            (category: IProductCategory): boolean => {
              return (
                this.generatedUnitProducts.filter(
                  (p: IGeneratedProduct): boolean =>
                    p.productCategoryId === category.id,
                ).length > 0
              );
            },
          );

          this.selectedProductCategoryId = this.productCategories?.[0]?.id;
        },
      );
  }

  public onProductCategorySelected(productCategoryId: string): void {
    this.selectedProductCategoryId = productCategoryId;
  }

  public addProductVariant(
    product: IGeneratedProduct,
    variantId: string,
  ): void {
    console.error('TODO addProductVariant', product, variantId);
    /* TODO variant object refactor
    const existingVariantOrderIdx = this.selectedOrder?.items.findIndex(
      (orderItem: IOrderItem): boolean =>
        orderItem.productId === product.id &&
        orderItem.variantId === variantId &&
        orderItem.priceShown.pricePerUnit === product.variants[variantId].price,
    );


    if ((existingVariantOrderIdx || 0) >= 0) {
      this._orderService.updateQuantity(
        fp.cloneDeep(<IOrder>this.selectedOrder),
        <number>existingVariantOrderIdx,
        1,
      );

      if (
        currentStatus(
          (<IOrder>this.selectedOrder).items[<number>existingVariantOrderIdx]
            .statusLog,
        ) === EOrderStatus.REJECTED
      ) {
        this._orderService.updateOrderItemStatus(
          (<IOrder>this.selectedOrder).id,
          EOrderStatus.PLACED,
          <number>existingVariantOrderIdx,
        );
      }
    } else {
      this._orderService.addProductVariant(
        fp.cloneDeep(<IOrder>this.selectedOrder),
        product,
        variantId,
      );
    }
    */
  }
}
