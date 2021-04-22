import { Observable } from 'rxjs';
import { delay, switchMap, take } from 'rxjs/operators';

// import * as printJS from 'print-js';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  dashboardActions,
  dashboardSelectors,
  IDashboardSettings,
} from '@bgap/admin/shared/data-access/dashboard';
import { ordersSelectors } from '@bgap/admin/shared/data-access/orders';
import {
  EDashboardListMode,
  EDashboardSize,
  ENebularButtonSize,
  IOrder,
  IOrderSum,
} from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { OrderPrintComponent } from '../order-print/order-print.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-ticket-body',
  templateUrl: './order-ticket-body.component.html',
  styleUrls: ['./order-ticket-body.component.scss'],
})
export class OrderTicketBodyComponent implements OnInit, OnDestroy {
  public dashboardSettings!: IDashboardSettings;
  public selectedOrder?: IOrder;
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  public ordersSum: IOrderSum = {};
  public userActiveOrders?: IOrder[];
  public EDashboardListMode = EDashboardListMode;
  public activeOrdersCount = 0;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _nbDialogService: NbDialogService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

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

    this._store
      .pipe(
        select(dashboardSelectors.getListMode),
        switchMap(
          (listMode: EDashboardListMode): Observable<IOrder | undefined> => {
            return this._store.pipe(
              select(
                listMode === EDashboardListMode.CURRENT
                  ? dashboardSelectors.getSelectedActiveOrder()
                  : dashboardSelectors.getSelectedHistoryOrder(),
              ),
            );
          },
        ),
        delay(0), // ExpressionChangedAfterItHasBeenCheckedError - trick
        untilDestroyed(this),
      )
      .subscribe((selectedOrder: IOrder | undefined): void => {
        this.selectedOrder = selectedOrder;

        this._getOrdersInfo();

        this._changeDetectorRef.detectChanges();
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _getOrdersInfo(): void {
    if (this.selectedOrder) {
      this.ordersSum = {
        selected: this.selectedOrder.sumPriceShown.priceSum,
        currency: this.selectedOrder.sumPriceShown.currency,
      };

      this._store
        .pipe(
          select(
            ordersSelectors.getActiveOrdersCountByUserId(
              this.selectedOrder.userId,
            ),
          ),
          take(1),
        )
        .subscribe((activeOrdersCount: number): void => {
          this.activeOrdersCount = activeOrdersCount;

          this._changeDetectorRef.detectChanges();
        });

      this._store
        .pipe(
          select(
            ordersSelectors.getActiveOrdersByUserId(this.selectedOrder.userId),
          ),
          take(1),
        )
        .subscribe((userActiveOrders: IOrder[]): void => {
          this.userActiveOrders = userActiveOrders;

          this.ordersSum.all = 0;
          // TODO map changed to forEach, check this!
          this.userActiveOrders.forEach((o: IOrder): void => {
            this.ordersSum.all =
              (this.ordersSum?.all || 0) + o.sumPriceShown.priceSum;
          });

          this._changeDetectorRef.detectChanges();
        });
    }
  }

  public editSelectedOrder(): void {
    this._store.dispatch(
      dashboardActions.setOrderEditing({
        orderEditing: !this.dashboardSettings.orderEditing,
      }),
    );
  }

  public toggleShowAllUserOrders(): void {
    this._store.dispatch(
      dashboardActions.setShowAllUserOrders({
        showAllUserOrders: !this.dashboardSettings.showAllUserOrders,
      }),
    );
  }

  public print(): void {
    /*
    printJS({
      printable: 'print-content',
      type: 'html',
      showModal: false,
      targetStyles: ['*'],
      font_size: '10px;',
      font: 'Arial',
    });
    */

    const dialog = this._nbDialogService.open(OrderPrintComponent, {
      dialogClass: 'print-dialog',
    });

    dialog.componentRef.instance.orders = (this.dashboardSettings
      .showAllUserOrders
      ? this.userActiveOrders
      : [this.selectedOrder]) as IOrder[];
  }
}
