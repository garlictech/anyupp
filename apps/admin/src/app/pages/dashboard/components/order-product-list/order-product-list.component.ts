import { cloneDeep as _cloneDeep, get as _get } from 'lodash-es';
import { combineLatest } from 'rxjs';
import { skipWhile } from 'rxjs/operators';

import { Component, Input } from '@angular/core';
import {
  EDashboardSize, ENebularButtonSize, EOrderStatus, IAdminUser, IGroup, IOrder, IOrderItem, IProduct, IProductCategory
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { currentStatus } from '../../../../shared/pure/orders';
import { OrderService } from '../../../../shared/services/order';
import { IState } from '../../../../store';
import {
  currentUserSelectors, groupListSelectors, productCategoryListSelectors, productListSelectors
} from '../../../../store/selectors';

@UntilDestroy()
@Component({
  selector: 'bgap-order-product-list',
  templateUrl: './order-product-list.component.html',
  styleUrls: ['./order-product-list.component.scss']
})
export class OrderProductListComponent {
  @Input() selectedOrder: IOrder;
  public generatedUnitProducts: IProduct[];
  public productCategories: IProductCategory[];
  public selectedProductCategoryId: string;
  public groupCurrency: string;
  public buttonSize: ENebularButtonSize;

  constructor(
    private _store: Store<IState>,
    private _orderService: OrderService
  ) {
    this.generatedUnitProducts = [];

    this._store
      .pipe(
        select(groupListSelectors.getSeletedGroup),
        skipWhile((group): boolean => !group)
      )
      .subscribe((group: IGroup): void => {
        this.groupCurrency = group.currency;
      });

    this._store
      .pipe(select(currentUserSelectors.getAdminUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this.buttonSize =
          _get(adminUser, 'settings.dashboardSize') === EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;
      });

    combineLatest([
      this._store.pipe(
        select(productCategoryListSelectors.getAllProductCategories),
        untilDestroyed(this)
      ),
      this._store.pipe(
        select(productListSelectors.getAllGeneratedUnitProducts),
        untilDestroyed(this)
      )
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([productCategories, generatedUnitProducts]: [
          IProductCategory[],
          IProduct[]
        ]): void => {
          this.generatedUnitProducts = generatedUnitProducts;

          this.productCategories = productCategories.filter(
            (category: IProductCategory): boolean => {
              return (
                this.generatedUnitProducts.filter(
                  (p: IProduct): boolean => p.productCategoryId === category._id
                ).length > 0
              );
            }
          );

          this.selectedProductCategoryId = _get(
            this.productCategories,
            '[0]._id',
            undefined
          );
        }
      );
  }

  public onProductCategorySelected(productCategoryId: string): void {
    this.selectedProductCategoryId = productCategoryId;
  }

  public addProductVariant(product: IProduct, variantId: string): void {
    const existingVariantOrderIdx = this.selectedOrder.items.findIndex(
      (orderItem: IOrderItem): boolean =>
        orderItem.productId === product._id &&
        orderItem.variantId === variantId &&
        orderItem.priceShown.pricePerUnit === product.variants[variantId].price
    );

    if (existingVariantOrderIdx >= 0) {
      this._orderService.updateQuantity(
        _cloneDeep(this.selectedOrder),
        existingVariantOrderIdx,
        1
      );

      if (
        currentStatus(
          this.selectedOrder.items[existingVariantOrderIdx].statusLog
        ) === EOrderStatus.REJECTED
      ) {
        this._orderService.updateOrderItemStatus(
          this.selectedOrder._id,
          EOrderStatus.PLACED,
          existingVariantOrderIdx
        );
      }
    } else {
      this._orderService.addProductVariant(
        _cloneDeep(this.selectedOrder),
        product,
        variantId
      );
    }
  }
}
