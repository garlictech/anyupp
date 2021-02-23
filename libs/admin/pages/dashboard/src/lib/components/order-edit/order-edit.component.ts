import { cloneDeep as _cloneDeep, get as _get } from 'lodash-es';

import { Component, Input, OnDestroy } from '@angular/core';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { dashboardActions } from '@bgap/admin/shared/data-access/dashboard';
import { DataService, OrderService } from '@bgap/admin/shared/data-access/data';
import { currentStatus as currentStatusFn } from '@bgap/admin/shared/data-access/orders';
import {
  EDashboardSize,
  ENebularButtonSize,
  EOrderStatus,
  EPaymentMethod,
  IAdminUser,
  IOrder,
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

        this.buttonSize =
          _get(this._adminUser, 'settings.dashboardSize') ===
          EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public updateQuantity(idx: number, value: number): void {
    this._orderService.updateQuantity(_cloneDeep(this.order), idx, value);
  }

  public removeOrder(): void {
    this._orderService
      .updateOrderStatus(_cloneDeep(this.order), EOrderStatus.REJECTED)
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
      this.order._id,
      EOrderStatus.REJECTED,
      idx,
    );
  }

  public updateOrderPaymentMethod(method: string): void {
    this._dataService.updateOrderPaymentMode(
      this._adminUser?.settings?.selectedChainId || '',
      this._adminUser?.settings?.selectedUnitId || '',
      this.order._id,
      {
        paymentMethod: method,
      },
    );
  }
}
