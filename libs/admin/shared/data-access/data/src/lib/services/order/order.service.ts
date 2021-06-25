import { cloneDeep } from 'lodash/fp';
import { EMPTY } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import {
  currentStatus,
  getOrderStatusByItemsStatus,
  ordersActions,
  ordersSelectors,
} from '@bgap/admin/shared/data-access/orders';
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
    return this._crudSdk.doMutation(
      this._crudSdk.sdk.UpdateOrder({
        input: {
          id: orderId,
          paymentMode,
        },
      }),
    );
  }

  public updateOrderStatus(order: CrudApi.Order, status: CrudApi.OrderStatus) {
    if (this._adminUser?.id) {
      return this._crudSdk.doMutation(
        this._crudSdk.sdk.UpdateOrder({
          input: {
            id: order.id,
            statusLog: [
              {
                status,
                ts: new Date().getTime(),
                userId: this._adminUser.id,
              },
            ],
          },
        }),
      );
    } else {
      return EMPTY;
    }
  }

  // TODO we should create a utility function to handle Order + all it's OrderItems state change, because we use it in several places
  // For now, the problem is that we use different logic, this should be standardized and solved in a single function that covers all the different logic used so far.
  public updateOrderStatusFromNoneToPlaced(order: CrudApi.Order) {
    if (this._adminUser?.id) {
      const userId = this._adminUser?.id;
      const items = cloneDeep(order.items);
      items.forEach(item => {
        // Update only none item status to placed!!!
        if (currentStatus(item.statusLog) === CrudApi.OrderStatus.none) {
          item.statusLog.push({
            status: CrudApi.OrderStatus.placed,
            ts: new Date().getTime(),
            userId,
          });
        }
      });

      return this._crudSdk.doMutation(
        this._crudSdk.sdk.UpdateOrder({
          input: {
            id: order.id,
            items,
            statusLog: [
              {
                status: CrudApi.OrderStatus.placed,
                ts: new Date().getTime(),
                userId,
              },
            ],
          },
        }),
      );
    } else {
      return EMPTY;
    }
  }

  public updateOrderItemStatus(
    orderId: string,
    status: CrudApi.OrderStatus,
    idx: number,
  ) {
    return this._store.pipe(
      select(ordersSelectors.getActiveOrderById(orderId)),
      take(1),
      switchMap((order: CrudApi.Order | undefined) => {
        if (order && this._adminUser?.id) {
          const _order = cloneDeep(order);
          _order.items[idx].statusLog.push({
            status,
            ts: new Date().getTime(),
            userId: this._adminUser.id,
          });

          const input: CrudApi.UpdateOrderInput = {
            id: order.id,
            items: _order.items,
          };

          const newOrderStatus = getOrderStatusByItemsStatus(_order);

          if (newOrderStatus) {
            input.statusLog = [
              {
                status: newOrderStatus,
                ts: new Date().getTime(),
                userId: this._adminUser.id,
              },
            ];
            if (
              newOrderStatus === CrudApi.OrderStatus.served &&
              _order.transaction?.status === CrudApi.PaymentStatus.success
            ) {
              input.archived = true;
            }
          }

          return this._crudSdk
            .doMutation(
              this._crudSdk.sdk.UpdateOrder({
                input,
              }),
            )
            .pipe(
              tap(() => {
                if (input.archived) {
                  this._store.dispatch(
                    ordersActions.removeActiveOrder({ orderId: _order.id }),
                  );
                }
              }),
            );
        } else {
          return EMPTY;
        }
      }),
    );
  }

  public updateOrderTransactionStatus(
    order: CrudApi.Order,
    status: CrudApi.PaymentStatus,
  ) {
    if (order.transactionId) {
      return this._crudSdk
        .doMutation(
          this._crudSdk.sdk.UpdateTransaction({
            input: {
              id: order.transactionId,
              status,
            },
          }),
        )
        .pipe(
          switchMap(() =>
            this._crudSdk.doMutation(
              this._crudSdk.sdk.UpdateOrder({
                input: {
                  id: order.id,
                  transactionStatus: status,
                },
              }),
            ),
          ),
        );
    } else {
      return EMPTY;
    }
  }

  public archiveOrder(order: CrudApi.Order, status?: CrudApi.OrderStatus) {
    if (this._adminUser?.id) {
      const input: CrudApi.UpdateOrderInput = {
        id: order.id,
        archived: true,
      };

      if (status) {
        input.statusLog = [
          {
            status,
            ts: new Date().getTime(),
            userId: this._adminUser.id,
          },
        ];
      }

      return this._crudSdk.doMutation(
        this._crudSdk.sdk.UpdateOrder({
          input,
        }),
      );
    } else {
      return EMPTY;
    }
  }
}
