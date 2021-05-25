import { skipWhile } from 'rxjs/operators';
import { Injectable } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { currentStatus } from '@bgap/admin/shared/data-access/orders';
import { select, Store } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

import { DataService } from '../data/data.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _adminUser?: CrudApi.AdminUser;
  private _groupCurrency?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store, private _dataService: DataService) {
    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser))
      .subscribe(adminUser => {
        this._adminUser = adminUser;
      });

    this._store
      .pipe(
        select(groupsSelectors.getSeletedGroup),
        skipWhile((group): boolean => !group),
      )
      .subscribe((group: CrudApi.Group | undefined): void => {
        this._groupCurrency = group?.currency;
      });
  }

  public updateQuantity(
    order: CrudApi.Order,
    idx: number,
    value: number,
  ): void {
    order.items[idx].quantity += value;

    if (order.items[idx].quantity > 0) {
      order.items[idx].priceShown.priceSum =
        order.items[idx].quantity * order.items[idx].priceShown.pricePerUnit;
      order.sumPriceShown.priceSum = 0;
      order.items.forEach((item: CrudApi.OrderItem): void => {
        order.sumPriceShown.priceSum += item.priceShown.priceSum;
      });
      order.sumPriceShown.taxSum =
        order.sumPriceShown.priceSum * 0.01 * order.sumPriceShown.tax;

      this._dataService
        .updateOrderItemQuantityAndPrice(
          this._adminUser?.settings?.selectedChainId || '',
          this._adminUser?.settings?.selectedUnitId || '',
          order.id,
          idx,
          order.items[idx],
        )
        .then((): void => {
          if (
            currentStatus(order.items[idx].statusLog) ===
            CrudApi.OrderStatus.rejected
          ) {
            this.updateOrderItemStatus(
              order.id,
              CrudApi.OrderStatus.placed,
              idx,
            );
          }
        });
    }
  }

  public addProductVariant(
    order: CrudApi.Order,
    product: CrudApi.GeneratedProduct,
    variantId: string,
  ): void {
    // const now = new Date().getTime();
    // const tax = parseInt(product.tax || '0', 10);
    console.error('addProductVariant', order, product, variantId);

    /* TODO variant fix
    this._dataService.addOrderItem(
      this._adminUser?.settings?.selectedChainId || '',
      this._adminUser?.settings?.selectedUnitId || '',
      order.id,
      order.items.length,
      {
        created: now,
        priceShown: {
          currency: this._groupCurrency || '',
          pricePerUnit: product.variants[variantId].price || 0,
          priceSum: product.variants[variantId].price || 0,
          tax,
          taxSum:
            ((product.variants[variantId].price || 0) / (100 + tax)) * tax,
        },
        productId: product.id,
        productName: product.name,
        quantity: 1,
        statusLog: {
          [now]: {
            status: CrudApi.OrderStatus.placed,
            userId: this._adminUser?.id || '',
          },
        },
        variantId,
        variantName: product.variants[variantId].variantName,
      },
    );*/
  }

  public updateOrderStatus(
    order: CrudApi.Order,
    status: CrudApi.OrderStatus,
  ): Promise<unknown> {
    return this._dataService.insertOrderStatus(
      this._adminUser?.settings?.selectedChainId || '',
      this._adminUser?.settings?.selectedUnitId || '',
      order.id,
      status,
    );
  }

  public updateOrderItemStatus(
    orderId: string,
    status: CrudApi.OrderStatus,
    idx: number,
  ): Promise<unknown> {
    return this._dataService.insertOrderItemStatus(
      this._adminUser?.settings?.selectedChainId || '',
      this._adminUser?.settings?.selectedUnitId || '',
      orderId,
      idx,
      {
        [new Date().valueOf()]: {
          status,
          userId: this._adminUser?.id || '',
        },
      },
    );
  }
}
