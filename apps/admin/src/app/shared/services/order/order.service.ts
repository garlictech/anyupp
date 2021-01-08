import { skipWhile } from 'rxjs/operators';
import { currentStatus } from '../../pure/orders';
import { IState } from '../../../store';
import {
  currentUserSelectors,
  groupListSelectors
} from '../../../store/selectors';

import { Injectable } from '@angular/core';
import { select, Store } from '@ngrx/store';

import { EOrderStatus } from '../../enums';
import {
  IAdminUser,
  IGroup,
  IOrder,
  IOrderItem,
  IProduct
} from '../../interfaces';
import { LocalizePipe } from '../../pipes';
import { DataService } from '../data';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private _adminUser: IAdminUser;
  private _groupCurrency: string;

  constructor(
    private _store: Store<IState>,
    private _dataService: DataService,
    private _localizePipe: LocalizePipe
  ) {
    this._store
      .pipe(select(currentUserSelectors.getAdminUser))
      .subscribe((adminUser: IAdminUser): void => {
        this._adminUser = adminUser;
      });

    this._store
      .pipe(
        select(groupListSelectors.getSeletedGroup),
        skipWhile((group): boolean => !group)
      )
      .subscribe((group: IGroup): void => {
        this._groupCurrency = group?.currency;
      });
  }

  public updateQuantity(order: IOrder, idx: number, value: number): void {
    order.items[idx].quantity += value;

    if (order.items[idx].quantity > 0) {
      order.items[idx].priceShown.priceSum =
        order.items[idx].quantity * order.items[idx].priceShown.pricePerUnit;
      order.sumPriceShown.priceSum = 0;
      order.items.forEach((item: IOrderItem): void => {
        order.sumPriceShown.priceSum += item.priceShown.priceSum;
      });
      order.sumPriceShown.taxSum =
        order.sumPriceShown.priceSum * 0.01 * order.sumPriceShown.tax;

      this._dataService
        .updateOrderItemQuantityAndPrice(
          this._adminUser.settings.selectedChainId,
          this._adminUser.settings.selectedUnitId,
          order.userId,
          order._id,
          idx,
          order.items[idx]
        )
        .then((): void => {
          if (
            currentStatus(order.items[idx].statusLog) === EOrderStatus.REJECTED
          ) {
            this.updateOrderItemStatus(
              order._id,
              order.userId,
              EOrderStatus.PLACED,
              idx
            );
          }
        });
    }
  }

  public addProductVariant(
    order: IOrder,
    product: IProduct,
    variantId: string
  ): void {
    const now = new Date().getTime();
    const tax = parseInt(product.tax || '0', 10);

    this._dataService.addOrderItem(
      this._adminUser.settings.selectedChainId,
      this._adminUser.settings.selectedUnitId,
      order.userId,
      order._id,
      order.items.length,
      {
        created: now,
        priceShown: {
          currency: this._groupCurrency,
          pricePerUnit: product.variants[variantId].price,
          priceSum: product.variants[variantId].price,
          tax,
          taxSum: (product.variants[variantId].price / (100 + tax)) * tax
        },
        productId: product._id,
        productName: product.name,
        quantity: 1,
        statusLog: {
          [now]: {
            status: EOrderStatus.PLACED,
            userId: this._adminUser._id
          }
        },
        variantId,
        variantName: product.variants[variantId].variantName
      }
    );
  }

  public updateOrderStatus(order: IOrder, status: EOrderStatus): Promise<void> {
    return this._dataService.insertOrderStatus(
      this._adminUser.settings.selectedChainId,
      this._adminUser.settings.selectedUnitId,
      order.userId,
      order._id,
      status
    );
  }

  public updateOrderItemStatus(
    orderId: string,
    orderUserId: string,
    status: EOrderStatus,
    idx: number
  ): Promise<void> {
    return this._dataService.insertOrderItemStatus(
      this._adminUser.settings.selectedChainId,
      this._adminUser.settings.selectedUnitId,
      orderUserId,
      orderId,
      idx,
      {
        [new Date().valueOf()]: {
          status,
          userId: this._adminUser._id
        }
      }
    );
  }
}
