import { of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

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
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import {
  adminUserRoleIsAtLeast,
  currentStatus as currentStatusFn,
} from '@bgap/crud-gql/api';

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
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  public workingOrderStatus: boolean;
  public allowRecallHistoryOrder = false;
  public currentStatus = currentStatusFn;
  public EServingMode = CrudApi.ServingMode;

  constructor(
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
          this.allowRecallHistoryOrder = adminUserRoleIsAtLeast(
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
    return currentStatusFn(this.order.statusLog || []);
  }

  public getButtonStatus(status: CrudApi.StatusLog[]): string {
    return getStatusColor(currentStatusFn(status));
  }

  public getPlacedButtonStatus(): string {
    return getStatusColor(CrudApi.OrderStatus.placed);
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public async updateOrderStatus(): Promise<void> {
    const currentStatus = currentStatusFn(this.order.statusLog);

    if (currentStatus === CrudApi.OrderStatus.none) {
      this.workingOrderStatus = true;

      this._orderService
        .updateOrderStatusFromNoneToPlaced(this.order)
        .subscribe(() => {
          this.workingOrderStatus = false;
          this._changeDetectorRef.detectChanges();
        });
    } else {
      const status = getNextOrderStatus(currentStatus);

      if (status) {
        this.workingOrderStatus = true;

        this._orderService
          .updateOrderStatus(this.order, status)
          .subscribe(() => {
            this.workingOrderStatus = false;

            // Archive order only after status change! We need to get the latest status
            if (
              status === CrudApi.OrderStatus.served &&
              (this.order.transaction?.status ===
                CrudApi.PaymentStatus.success ||
                this.order.transaction?.status === CrudApi.PaymentStatus.failed)
            ) {
              this._orderService.archiveOrder(this.order).subscribe();
            }

            this._changeDetectorRef.detectChanges();
          });
      }
    }
  }

  public updateOrderItemStatus(idx: number): void {
    const status = getNextOrderStatus(
      currentStatusFn(this.order.items[idx].statusLog),
    );

    if (status) {
      this._orderService
        .updateOrderItemStatus(this.order.id, status, idx)
        .subscribe();
    }
  }

  public updateOrderPaymentMethod(paymentMode: CrudApi.PaymentMode): void {
    this._orderService
      .updateOrderPaymentMode(this.order.id, paymentMode)
      .subscribe();
  }

  public async transactionStatusSuccess(): Promise<void> {
    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    dialog.componentRef.instance.options = {
      message: 'orders.confirmSuccessTransaction',
      buttons: [
        {
          label: 'common.ok',
          callback: this._updateTransactionStatusCallback(
            CrudApi.PaymentStatus.success,
          ),
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

  public async transactionStatusFailed(): Promise<void> {
    const dialog = this._nbDialogService.open(UnpayCategoriesComponent);

    dialog.componentRef.instance.clickCallback = (
      unpayCategory: CrudApi.UnpayCategory,
    ) =>
      this._updateTransactionStatusCallback(
        CrudApi.PaymentStatus.failed,
        unpayCategory,
      )();
  }

  private _updateTransactionStatusCallback =
    (
      paymentStatus: CrudApi.PaymentStatus,
      unpayCategory?: CrudApi.UnpayCategory,
    ) =>
    () => {
      if (this.order.transactionId) {
        this._orderService
          .updateOrderTransactionStatus(
            this.order,
            paymentStatus,
            unpayCategory,
          )
          .pipe(
            switchMap(() => {
              const currentStatus = currentStatusFn(this.order.statusLog);

              if (paymentStatus === CrudApi.PaymentStatus.success) {
                if (currentStatus === CrudApi.OrderStatus.none) {
                  return this._orderService.updateOrderStatusFromNoneToPlaced(
                    this.order,
                  );
                } else if (currentStatus === CrudApi.OrderStatus.served) {
                  return this._orderService.archiveOrder(this.order);
                }

                return of(true);
              } else if (
                paymentStatus === CrudApi.PaymentStatus.failed &&
                currentStatus === CrudApi.OrderStatus.served
              ) {
                return this._orderService.archiveOrder(this.order);
              }

              return of(true);
            }),
          )
          .subscribe();
      }
    };

  public resetOrderItemStatus(idx: number): void {
    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    dialog.componentRef.instance.options = {
      message: 'orders.confirmResetOrderItemStatus',
      buttons: [
        {
          label: 'common.ok',
          callback: (): void => {
            this._orderService
              .updateOrderItemStatus(
                this.order.id,
                CrudApi.OrderStatus.placed,
                idx,
              )
              .subscribe();
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

  public deleteOrder(): void {
    const dialog = this._nbDialogService.open(ConfirmDialogComponent);

    dialog.componentRef.instance.options = {
      message: 'orders.confirmDeleteOrder',
      buttons: [
        {
          label: 'common.ok',
          callback: async () => {
            if (this.order.id) {
              this._orderService
                .updateOrderStatus(this.order, CrudApi.OrderStatus.rejected)
                .pipe(
                  switchMap(() => this._orderService.archiveOrder(this.order)),
                )
                .subscribe(() => {
                  this._changeDetectorRef.detectChanges();
                });
            }
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
          callback: (): void => {
            this._orderService.recallOrderFromHistory(order).subscribe();
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
