import * as fp from 'lodash/fp';

import { Component, Input, OnDestroy } from '@angular/core';
import { dashboardActions, dashboardSelectors } from '@bgap/admin/shared/data-access/dashboard';
import { DataService, OrderService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { currentStatus as currentStatusFn } from '@bgap/admin/shared/data-access/orders';
import {
  EDashboardSize, ENebularButtonSize, EOrderStatus, EPaymentMethod, IAdminUser, IOrder
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

interface IPaymentMethodKV {
  key: string;
  value: EPaymentMethod;
}

@UntilDestroy()
@Component({
  selector: 'bgap-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss'],
})
export class OrderEditComponent implements OnDestroy {
  @Input() order!: IOrder;
  public paymentMethods: IPaymentMethodKV[] = [];
  public EOrderStatus = EOrderStatus;
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  public workingOrderStatus: boolean;
  public currentStatus = currentStatusFn;

  private _adminUser?: IAdminUser;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _orderService: OrderService,
    private _dataService: DataService,
  ) {
    this.workingOrderStatus = false;

    Object.keys(EPaymentMethod).forEach((key: string): void => {
      this.paymentMethods.push({
        key,
        value: EPaymentMethod[<keyof typeof EPaymentMethod>key],
      });
    });

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this._adminUser = adminUser;
      });

    this._store
      .pipe(select(dashboardSelectors.getSize), untilDestroyed(this))
      .subscribe((size: EDashboardSize): void => {
        this.buttonSize =
          size === EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public updateQuantity(idx: number, value: number): void {
    this._orderService.updateQuantity(fp.cloneDeep(this.order), idx, value);
  }

  public removeOrder(): void {
    this._orderService
      .updateOrderStatus(fp.cloneDeep(this.order), EOrderStatus.REJECTED)
      .then(
        (): void => {
          this.workingOrderStatus = false;
        },
        (err): void => {
          console.error(err);
          this.workingOrderStatus = false;
        },
      );

    this._store.dispatch(
      dashboardActions.setOrderEditing({
        orderEditing: false,
      }),
    );
  }

  public removeOrderItem(idx: number): void {
    this._orderService.updateOrderItemStatus(
      this.order.id,
      EOrderStatus.REJECTED,
      idx,
    );
  }

  public updateOrderPaymentMethod(method: string): void {
    this._dataService.updateOrderPaymentMode(
      this._adminUser?.settings?.selectedChainId || '',
      this._adminUser?.settings?.selectedUnitId || '',
      this.order.id,
      {
        paymentMethod: method,
      },
    );
  }
}
