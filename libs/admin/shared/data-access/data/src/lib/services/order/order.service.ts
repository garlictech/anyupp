import * as fp from 'lodash/fp';
import { take } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { ordersSelectors } from '@bgap/admin/shared/data-access/orders';
import * as CrudApi from '@bgap/crud-gql/api';
import { select, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _adminUser?: CrudApi.AdminUser;
  private _groupCurrency?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store) {
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
    console.error('TODO UPDATE');
    /*
    return this._amplifyDataService.patch('updateOrder', {
      id: orderId,
      paymentMode,
    });
    */
  }

  public updateOrderStatus(order: CrudApi.Order, status: CrudApi.OrderStatus) {
    console.error('TODO UPDATE');
    /*
    return this._amplifyDataService.patch('updateOrder', {
      id: order.id,
      statusLog: [
        { status, ts: new Date().getTime(), userId: this._adminUser?.id || '' },
      ],
    });
    */
  }

  public updateOrderItemStatus(
    orderId: string,
    status: CrudApi.OrderStatus,
    idx: number,
  ): void {
    console.error('TODO UPDATE');
    /*
    this._store
      .pipe(select(ordersSelectors.getActiveOrderById(orderId)), take(1))
      .subscribe(
        async (order: IOrder | undefined): Promise<void> => {
          if (order) {
            const _order = fp.cloneDeep(order);
            _order.items[idx].statusLog.push({
              status,
              ts: new Date().getTime(),
              userId: this._adminUser?.id || '',
            });

            await this._amplifyDataService.patch('updateOrder', {
              id: orderId,
              items: _order.items,
            });
          }
        },
      );
      */
  }

  public updateOrderTransactionStatus(
    transactionId: string,
    status: CrudApi.PaymentStatus,
  ): void {
    console.error('TODO UPDATE');
    /*
    return this._amplifyDataService.patch('updateTransaction', {
      id: transactionId,
      status,
    });
    */
  }

  public async moveOrderToHistory(
    order: CrudApi.Order,
    status: CrudApi.OrderStatus,
  ) {
    console.error('TODO moveOrderToHistory order', order);

    /*
    const historyOrder = fp.omit(['createdAt', 'updatedAt', 'orderNum'], fp.cloneDeep(order));
    const statusObject = {
      status,
      ts: new Date().getTime(),
      userId: this._adminUser?.id || '',
    };

    historyOrder.items.forEach(item => {
      item.statusLog.push(statusObject);
    });
    historyOrder.statusLog = [statusObject];

    console.error('moveOrderToHistory historyOrder', historyOrder);

    try {
      await this._amplifyDataService.create('createOrderHistory', historyOrder);
    } catch (err) {
      console.error('errr', err);
    }

    console.error('READY');
    */
  }
}
