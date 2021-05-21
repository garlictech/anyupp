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
import { OrderService } from '@bgap/admin/shared/data-access/data';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import {
  EDashboardSize,
  ENebularButtonSize,
  IGeneratedProduct,
  IGroup,
  IOrder,
  IProduct,
  IProductCategory,
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-product-list',
  templateUrl: './order-product-list.component.html',
  styleUrls: ['./order-product-list.component.scss'],
})
export class OrderProductListComponent implements OnInit, OnDestroy {
  @Input() selectedOrder?: IOrder;
  public generatedUnitProducts: IGeneratedProduct[];
  public productCategories: IProductCategory[] = [];
  public selectedProductCategoryId = '';
  public groupCurrency = '';
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _orderService: OrderService,
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
      .subscribe((group: IGroup | undefined): void => {
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
        select(productsSelectors.getAllGeneratedProducts),
        untilDestroyed(this),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([productCategories, generatedUnitProducts]: [
          IProductCategory[],
          IProduct[],
        ]): void => {
          this.generatedUnitProducts = <IGeneratedProduct[]>(
            generatedUnitProducts
          );

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

          this._changeDetectorRef.detectChanges();
        },
      );
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
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
        ) === CrudApi.OrderStatus.REJECTED
      ) {
        this._orderService.updateOrderItemStatus(
          (<IOrder>this.selectedOrder).id,
          CrudApi.OrderStatus.PLACED,
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
