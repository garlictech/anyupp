import {
  EDashboardListMode,
  EDashboardSize,
  ENebularButtonSize,
  EOrderStatus,
} from 'src/app/shared/enums';
import { IOrder, IStatusLog } from 'src/app/shared/interfaces';
import { ConfirmDialogComponent } from 'src/app/shared/modules/shared-components/components/confirm-dialog/confirm-dialog.component';
import {
  currentStatus as currentStatusFn,
  getNextOrderItemStatus,
  getNextOrderStatus,
  getStatusColor,
} from 'src/app/shared/pure/orders';
import { OrderService } from 'src/app/shared/services/order';
import { IState } from 'src/app/store';
import { dashboardSelectors } from 'src/app/store/selectors';
import { IDashboardSettings } from 'src/app/store/state';

import { Component, Input, OnDestroy } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'app-order-details',
  styleUrls: ['./order-details.component.scss'],
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent implements OnDestroy {
  @Input() order: IOrder;
  public dashboardSettings: IDashboardSettings;
  public EDashboardListMode = EDashboardListMode;
  public EOrderStatus = EOrderStatus;
  public buttonSize: ENebularButtonSize;
  public workingOrderStatus: boolean;
  public currentStatus = currentStatusFn;

  constructor(
    private _store: Store<IState>,
    private _orderService: OrderService,
    private _nbDialogService: NbDialogService
  ) {
    this.workingOrderStatus = false;

    this._store
      .pipe(select(dashboardSelectors.getSettings), untilDestroyed(this))
      .subscribe((dashboardSettings: IDashboardSettings): void => {
        this.dashboardSettings = dashboardSettings;

        this.buttonSize =
          this.dashboardSettings.size === EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;
      });
  }

  public getButtonStatus(status: IStatusLog): string {
    return getStatusColor(currentStatusFn(status));
  }

  public getPlacedButtonStatus(): string {
    return getStatusColor(EOrderStatus.PLACED);
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public updateOrderStatus(): void {
    const status = getNextOrderStatus(currentStatusFn(this.order.statusLog));

    if (status) {
      this.workingOrderStatus = true;

      this._orderService.updateOrderStatus(this.order, status).then(
        (): void => {
          this.workingOrderStatus = false;
        },
        (err): void => {
          console.error(err);
          this.workingOrderStatus = false;
        }
      );
    }
  }

  public updateOrderItemStatus(idx: number): void {
    const status = getNextOrderItemStatus(
      currentStatusFn(this.order.items[idx].statusLog)
    );

    if (status) {
      this._orderService.updateOrderItemStatus(
        this.order._id,
        this.order.userId,
        status,
        idx
      );
    }
  }

  public resetOrderItemStatus(idx: number): void {
    const dialog = this._nbDialogService.open(ConfirmDialogComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.options = {
      message: 'orders.confirmResetOrderItemStatus',
      buttons: [
        {
          label: 'common.ok',
          callback: (): void => {
            this._orderService.updateOrderItemStatus(
              this.order._id,
              this.order.userId,
              EOrderStatus.PLACED,
              idx
            );
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
          callback: (): void => {},
          status: 'basic',
        },
      ],
    };
  }
}
