import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  dashboardSelectors,
  IDashboardSettings,
} from '@bgap/admin/shared/data-access/dashboard';
import { ConfirmDialogComponent } from '@bgap/admin/shared/components';
import { OrderService } from '@bgap/admin/shared/data-access/data';
import {
  currentStatus as currentStatusFn,
  getNextOrderItemStatus,
  getNextOrderStatus,
  getStatusColor,
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
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-details',
  styleUrls: ['./order-details.component.scss'],
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  @Input() order!: IOrder;
  public dashboardSettings!: IDashboardSettings;
  public EDashboardListMode = EDashboardListMode;
  public EOrderStatus = EOrderStatus;
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  public workingOrderStatus: boolean;
  public currentStatus = currentStatusFn;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store,
    private _orderService: OrderService,
    private _nbDialogService: NbDialogService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.workingOrderStatus = false;
  }

  ngOnInit(): void {
    this._store
      .pipe(select(dashboardSelectors.getSettings), untilDestroyed(this))
      .subscribe((dashboardSettings: IDashboardSettings): void => {
        this.dashboardSettings = dashboardSettings;

        this.buttonSize =
          this.dashboardSettings.size === EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;

        this._changeDetectorRef.detectChanges();
      });
  }

  public getButtonStatus(status: IStatusLog[]): string {
    // TODO EZ TOMB, EDDIG Sima StatusLog volt, hogyan mukodott eddig?
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
        },
      );

      this._changeDetectorRef.detectChanges();
    }
  }

  public updateOrderItemStatus(idx: number): void {
    const status = getNextOrderItemStatus(
      currentStatusFn(this.order.items[idx].statusLog),
    );

    if (status) {
      this._orderService.updateOrderItemStatus(this.order.id, status, idx);

      this._changeDetectorRef.detectChanges();
    }
  }

  public resetOrderItemStatus(idx: number): void {
    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    dialog.componentRef.instance.options = {
      message: 'orders.confirmResetOrderItemStatus',
      buttons: [
        {
          label: 'common.ok',
          callback: (): void => {
            this._orderService.updateOrderItemStatus(
              this.order.id,
              EOrderStatus.PLACED,
              idx,
            );

            this._changeDetectorRef.detectChanges();
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
