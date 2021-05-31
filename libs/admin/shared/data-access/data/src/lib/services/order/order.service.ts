import { ordersSelectors } from 'libs/admin/shared/data-access/orders/src';
import { cloneDeep, omit } from 'lodash/fp';
import { take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import { select, Store } from '@ngrx/store';

import { CrudSdkService } from '../crud-sdk.service';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _adminUser?: CrudApi.AdminUser;
  private _groupCurrency?: string;

  constructor(private _store: Store, private _crudSdk: CrudSdkService) {
    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser))
      .subscribe(adminUser => {
        this._adminUser = adminUser;
      });

    /*
    this._store
      .pipe(
        select(groupsSelectors.getSeletedGroup),
        skipWhile((group): boolean => !group),
      )
      .subscribe((group: CrudApi.Group | undefined): void => {
        this._groupCurrency = group?.currency;
      });
    */
  }

  public updateQuantity(
    order: CrudApi.Order,
    idx: number,
    value: number,
  ): void {
    console.error('updateQuantity', order, idx, value);
    /*
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
    */
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

  public updateOrderPaymentMode(
    orderId: string,
    paymentMode: CrudApi.PaymentMode,
  ) {
    this._crudSdk.doMutation(
      this._crudSdk.sdk.UpdateOrder({
        input: {
          id: orderId,
          paymentMode,
        },
      }),
    );
  }

  public updateOrderStatus(order: CrudApi.Order, status: CrudApi.OrderStatus) {
    console.error('updateOrderStatus', status, order);
    this._crudSdk.doMutation(
      this._crudSdk.sdk.UpdateOrder({
        input: {
          id: order.id,
          statusLog: [
            {
              status,
              ts: new Date().getTime(),
              userId: this._adminUser?.id || '',
            },
          ],
        },
      }),
    );
  }

  public updateOrderItemStatus(
    orderId: string,
    status: CrudApi.OrderStatus,
    idx: number,
  ): void {
    this._store
      .pipe(select(ordersSelectors.getActiveOrderById(orderId)), take(1))
      .subscribe(
        async (order: CrudApi.Order | undefined): Promise<void> => {
          if (order) {
            const _order = cloneDeep(order);
            _order.items[idx].statusLog.push({
              status,
              ts: new Date().getTime(),
              userId: this._adminUser?.id || '',
            });

            this._crudSdk.doMutation(
              this._crudSdk.sdk.UpdateOrder({
                input: {
                  id: order.id,
                  items: _order.items,
                },
              }),
            );
          }
        },
      );
  }

  public updateOrderTransactionStatus(
    transactionId: string,
    status: CrudApi.PaymentStatus,
  ): void {
    this._crudSdk.doMutation(
      this._crudSdk.sdk.UpdateTransaction({
        input: {
          id: transactionId,
          status,
        },
      }),
    );
  }

  public async moveOrderToHistory(
    order: CrudApi.Order,
    status: CrudApi.OrderStatus,
  ) {
    const historyOrder = omit(
      ['createdAt', 'updatedAt', 'transaction'],
      cloneDeep(order),
    );
    const statusObject = {
      status,
      ts: new Date().getTime(),
      userId: this._adminUser?.id || '',
    };

    historyOrder.items.forEach(item => {
      item.statusLog.push(statusObject);
    });
    historyOrder.statusLog = [statusObject];

    try {
      await this._crudSdk.sdk
        .CreateOrderHistory({
          input: historyOrder,
        })
        .toPromise();

      await this._crudSdk.sdk
        .DeleteOrder({
          input: {
            id: order.id,
          },
        })
        .toPromise();
    } catch (err) {
      console.error('errr', err);
    }
  }
}
