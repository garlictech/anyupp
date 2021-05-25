import { NGXLogger } from 'ngx-logger';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { ConfirmDialogComponent } from '@bgap/admin/shared/components';
import {
  dashboardSelectors,
  IDashboardSettings,
} from '@bgap/admin/shared/data-access/dashboard';
import { OrderService } from '@bgap/admin/shared/data-access/data';
import {
  currentStatus as currentStatusFn,
  getNextOrderStatus,
  getStatusColor,
} from '@bgap/admin/shared/data-access/orders';

import {
  EDashboardListMode,
  EDashboardSize,
  ENebularButtonSize,
  IStatusLog,
} from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-details',
  styleUrls: ['./order-details.component.scss'],
  templateUrl: './order-details.component.html',
})
export class OrderDetailsComponent implements OnInit, OnDestroy {
  @Input() order!: CrudApi.Order;
  @Input() unit?: CrudApi.Unit;
  public dashboardSettings!: IDashboardSettings;
  public EDashboardListMode = EDashboardListMode;
  public EOrderStatus = CrudApi.OrderStatus;
  public EPaymentStatus = CrudApi.PaymentStatus;
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  public workingOrderStatus: boolean;
  public currentStatus = currentStatusFn;

  constructor(
    private _store: Store,
    private _orderService: OrderService,
    private _nbDialogService: NbDialogService,
    private _logger: NGXLogger,
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

  get currentOrderStatus() {
    return currentStatusFn(this.order.statusLog || []);
  }

  public getButtonStatus(status: CrudApi.StatusLog[]): string {
    // TODO EZ TOMB, EDDIG Sima StatusLog volt, hogyan mukodott eddig?
    return getStatusColor(currentStatusFn(status));
  }

  public getPlacedButtonStatus(): string {
    return getStatusColor(CrudApi.OrderStatus.placed);
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public async updateOrderStatus(): Promise<void> {
    const status = getNextOrderStatus(currentStatusFn(this.order.statusLog));

    if (status) {
      this.workingOrderStatus = true;

      try {
        if (status === CrudApi.OrderStatus.served) {
          await this._orderService.moveOrderToHistory(this.order, status);
        } else {
          await this._orderService.updateOrderStatus(this.order, status);
        }
      } catch (err) {
        // log error
      }

      this.workingOrderStatus = false;
      this._changeDetectorRef.detectChanges();
    }
  }

  public updateOrderItemStatus(idx: number): void {
    const status = getNextOrderStatus(
      currentStatusFn(this.order.items[idx].statusLog),
    );

    if (status) {
      this._orderService.updateOrderItemStatus(this.order.id, status, idx);

      this._changeDetectorRef.detectChanges();
    }
  }

  public updateOrderPaymentMethod(paymentMode: CrudApi.PaymentMode): void {
    this._orderService.updateOrderPaymentMode(this.order.id, paymentMode);
  }

  public async updateTransactionStatus(
    status: CrudApi.PaymentStatus,
  ): Promise<void> {
    if (this.order.transactionId) {
      try {
        await this._orderService.updateOrderTransactionStatus(
          this.order.transactionId,
          status,
        );

        if (
          status === CrudApi.PaymentStatus.success &&
          currentStatusFn(this.order.statusLog) === CrudApi.OrderStatus.none
        ) {
          this._orderService.updateOrderStatus(
            this.order,
            CrudApi.OrderStatus.placed,
          );
        }
      } catch (err) {
        this._logger.error(
          `UPDATE ORDER TRANSACTION ERROR: ${JSON.stringify(err)}`,
        );
      }
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

              CrudApi.OrderStatus.placed,

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

  public isListMode(status: keyof typeof EDashboardListMode): boolean {
    return this.dashboardSettings.listMode === EDashboardListMode[status];
  }

  public isStatusLog(
    orderItem: CrudApi.OrderItem,
    status: keyof typeof CrudApi.OrderStatus,
  ): boolean {
    return (
      this.currentStatus(orderItem.statusLog) === CrudApi.OrderStatus[status]
    );
  }
}
