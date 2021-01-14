import { cloneDeep as _cloneDeep, get as _get } from 'lodash-es';
import {
  EDashboardSize,
  ENebularButtonSize,
  EOrderStatus,
  EPaymentMethod
} from '../../../../shared/enums';
import { IAdminUser, IOrder } from '../../../../shared/interfaces';
import { currentStatus as currentStatusFn } from '../../../../shared/pure/orders';
import { DataService } from '../../../../shared/services/data';
import { OrderService } from '../../../../shared/services/order';
import { IState } from '../../../../store';
import { currentUserSelectors } from '../../../../store/selectors';

import { Component, Input, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { dashboardActions } from '../../../../store/actions';
import { select, Store } from '@ngrx/store';

interface IPaymentMethodKV {
  key: string;
  value: EPaymentMethod
}

@UntilDestroy()
@Component({
  selector: 'bgap-order-edit',
  templateUrl: './order-edit.component.html',
  styleUrls: ['./order-edit.component.scss']
})
export class OrderEditComponent implements OnDestroy {
  @Input() order: IOrder;
  public paymentMethods: IPaymentMethodKV[] = [];
  public EOrderStatus = EOrderStatus;
  public buttonSize: ENebularButtonSize;
  public workingOrderStatus: boolean;
  public currentStatus = currentStatusFn;

  private _adminUser: IAdminUser;

  constructor(
    private _store: Store<IState>,
    private _orderService: OrderService,
    private _dataService: DataService
  ) {
    this.workingOrderStatus = false;

    Object.keys(EPaymentMethod).forEach((key): void => {
      this.paymentMethods.push({
        key,
        value: EPaymentMethod[key]
      });
    });

    this._store
      .pipe(select(currentUserSelectors.getAdminUser), untilDestroyed(this))
      .subscribe((adminUser: IAdminUser): void => {
        this._adminUser = adminUser;

        this.buttonSize =
          _get(this._adminUser, 'settings.dashboardSize') ===
          EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;
      });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
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
        }
      );

    this._store.dispatch(
      dashboardActions.setOrderEditing({
        orderEditing: false
      })
    );
  }

  public removeOrderItem(idx: number): void {
    this._orderService.updateOrderItemStatus(
      this.order._id,
      this.order.userId,
      EOrderStatus.REJECTED,
      idx
    );
  }

  public updateOrderPaymentMethod(method: string): void {
    this._dataService.updateOrderPaymentMode(
      this._adminUser.settings.selectedChainId,
      this._adminUser.settings.selectedUnitId,
      this.order.userId,
      this.order._id,
      {
        paymentMethod: method
      }
    );
  }
}
