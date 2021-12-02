import { NGXLogger } from 'ngx-logger';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  ConfirmDialogComponent,
  UnpayCategoriesComponent,
} from '@bgap/admin/shared/components';
import {
  dashboardSelectors,
  DashboardSettings,
} from '@bgap/admin/shared/data-access/dashboard';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { OrderService } from '@bgap/admin/shared/data-access/order';
import {
  getNextOrderStatus,
  getStatusColor,
} from '@bgap/admin/shared/data-access/orders';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  EDashboardListMode,
  EDashboardSize,
  ENebularButtonSize,
} from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { OrderPrintComponent } from '../order-print/order-print.component';

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
  @Input() allowPrintOrder = false;
  public dashboardSettings!: DashboardSettings;
  public EDashboardListMode = EDashboardListMode;
  public EOrderStatus = CrudApi.OrderStatus;
  public EPaymentStatus = CrudApi.PaymentStatus;
  public EServingMode = CrudApi.ServingMode;
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  public workingOrderStatus: boolean;
  public allowRecallHistoryOrder = false;
  public currentStatus = CrudApi.currentStatus;

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
      .subscribe((dashboardSettings: DashboardSettings): void => {
        this.dashboardSettings = dashboardSettings;

        this.buttonSize =
          this.dashboardSettings.size === EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;

        this._changeDetectorRef.detectChanges();
      });

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser), untilDestroyed(this))
      .subscribe(adminUser => {
        if (adminUser) {
          this.allowRecallHistoryOrder = CrudApi.adminUserRoleIsAtLeast(
            adminUser,
            CrudApi.Role.unitadmin,
          );
        } else {
          this.allowRecallHistoryOrder = false;
        }

        this._changeDetectorRef.detectChanges();
      });
  }

  get currentOrderStatus() {
    return CrudApi.currentStatus(this.order.statusLog || []);
  }

  public getButtonStatus(status: CrudApi.StatusLog[]): string {
    return getStatusColor(CrudApi.currentStatus(status));
  }

  public getPlacedButtonStatus(): string {
    return getStatusColor(CrudApi.OrderStatus.placed);
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public async updateOrderStatus(): Promise<void> {
    if (this.order) {
      this.workingOrderStatus = true;

      await this._orderService.handleOrderStatusChange$(this.order).toPromise();

      this.workingOrderStatus = false;
      this._changeDetectorRef.detectChanges();
    }
  }

  public async updateOrderItemStatus(idx: number): Promise<void> {
    const status = getNextOrderStatus(
      CrudApi.currentStatus(this.order.items[idx].statusLog),
    );

    if (status) {
      await this._orderService
        .updateOrderItemStatus$(this.order.id, status, idx)
        .toPromise();
    }
  }

  public async updateOrderPaymentMethod(
    paymentMode: CrudApi.PaymentMode,
  ): Promise<void> {
    await this._orderService
      .updateOrderPaymentMode$(this.order.id, paymentMode)
      .toPromise();
  }

  public async transactionStatusSuccess(): Promise<void> {
    if (this.order.transactionId) {
      const dialog = this._nbDialogService.open(ConfirmDialogComponent);

      dialog.componentRef.instance.options = {
        message: 'orders.confirmSuccessTransaction',
        buttons: [
          {
            label: 'common.ok',
            callback: async () => {
              await this._orderService
                .handleSuccessfulTransactionStatus$(
                  this.order,
                  CrudApi.PaymentStatus.success,
                )
                .toPromise();
            },
            status: 'success',
          },
          {
            label: 'common.cancel',
            status: 'basic',
          },
        ],
      };
    } else {
      this._logger.error(`Missing transactionId in order #${this.order.id}`);
    }
  }

  public async transactionStatusFailed(): Promise<void> {
    if (this.order.transactionId) {
      const dialog = this._nbDialogService.open(UnpayCategoriesComponent);

      dialog.componentRef.instance.clickCallback = async (
        unpayCategory: CrudApi.UnpayCategory,
      ) => {
        await this._orderService
          .handleFailedTransactionStatus$(
            this.order,
            CrudApi.PaymentStatus.failed,
            unpayCategory,
          )
          .toPromise();
      };
    } else {
      this._logger.error(`Missing transactionId in order #${this.order.id}`);
    }
  }

  public resetOrderItemStatus(idx: number): void {
    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    dialog.componentRef.instance.options = {
      message: 'orders.confirmResetOrderItemStatus',
      buttons: [
        {
          label: 'common.ok',
          callback: async (): Promise<void> => {
            await this._orderService
              .updateOrderItemStatus$(
                this.order.id,
                CrudApi.OrderStatus.placed,
                idx,
              )
              .toPromise();
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
          status: 'basic',
        },
      ],
    };
  }

  public deleteOrder(): void {
    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    dialog.componentRef.instance.options = {
      message: 'orders.confirmDeleteOrder',
      buttons: [
        {
          label: 'common.ok',
          callback: async () => {
            if (this.order.id) {
              await this._orderService.rejectOrder$(this.order.id).toPromise();
              this._changeDetectorRef.detectChanges();
            }
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
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

  public printOrder(order: CrudApi.Order) {
    const dialog = this._nbDialogService.open(OrderPrintComponent, {
      dialogClass: 'print-dialog',
    });

    dialog.componentRef.instance.orders = [order];
  }

  public recallOrderFromHistory(order: CrudApi.Order) {
    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    dialog.componentRef.instance.options = {
      message: 'orders.confirmRecallHistoryOrder',
      buttons: [
        {
          label: 'common.ok',
          callback: async () => {
            await this._orderService
              .recallOrderFromHistory$(order.id)
              .toPromise();
          },
          status: 'success',
        },
        {
          label: 'common.cancel',
          status: 'basic',
        },
      ],
    };
  }
}
