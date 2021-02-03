import { Component, Input, OnDestroy } from '@angular/core';
import { dashboardSelectors, IDashboardSettings } from '@bgap/admin/shared/data-access/dashboard';
import { ConfirmDialogComponent } from '@bgap/admin/shared/components';
import { OrderService } from '@bgap/admin/shared/data-access/data';
import {
  currentStatus as currentStatusFn, getNextOrderItemStatus, getNextOrderStatus, getStatusColor
} from '@bgap/admin/shared/data-access/orders';
import {
  EDashboardListMode,
  EDashboardSize,
  ENebularButtonSize,
  EOrderStatus,
  IOrder,
  IStatusLog,
} from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-order-details',
  styleUrls: ['./order-details.component.scss'],
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent implements OnDestroy {
  @Input() order!: IOrder;
  public dashboardSettings!: IDashboardSettings;
  public EDashboardListMode = EDashboardListMode;
  public EOrderStatus = EOrderStatus;
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  public workingOrderStatus: boolean;
  public currentStatus = currentStatusFn;

  constructor(
    private _store: Store<any>,
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

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
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
      this._orderService.updateOrderItemStatus(this.order._id, status, idx);
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
              EOrderStatus.PLACED,
              idx
            );
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
          callback: (): void => {
            /**/
          },
          status: 'basic',
        },
      ],
    };
  }
}
