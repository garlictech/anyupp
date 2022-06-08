import { Observable } from 'rxjs';
import { delay, switchMap, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Order, Unit } from '@bgap/domain';
import {
  EDashboardListMode,
  EDashboardSize,
  ENebularButtonSize,
  OrderSum,
} from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import {
  dashboardActions,
  dashboardSelectors,
  DashboardSettings,
} from '../../../../store/dashboard';
import { ordersSelectors } from '../../../../store/orders';
import { OrderPrintComponent } from '../order-print/order-print.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-ticket-body',
  templateUrl: './order-ticket-body.component.html',
  styleUrls: ['./order-ticket-body.component.scss'],
})
export class OrderTicketBodyComponent implements OnInit {
  @Input() unit?: Unit;
  public dashboardSettings!: DashboardSettings;
  public selectedOrder?: Order;
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  public ordersSum: OrderSum = {};
  public userActiveOrders?: Order[];
  public EDashboardListMode = EDashboardListMode;
  public activeOrdersCount = 0;

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this._store
      .pipe(select(dashboardSelectors.getSettings), untilDestroyed(this))
      .subscribe((dashboardSettings: DashboardSettings) => {
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
          (listMode: EDashboardListMode): Observable<Order | undefined> => {
            return this._store.pipe(
              select(
                listMode === EDashboardListMode.current
                  ? dashboardSelectors.getSelectedActiveOrder()
                  : dashboardSelectors.getSelectedHistoryOrder(),
              ),
            );
          },
        ),
        delay(0), // ExpressionChangedAfterItHasBeenCheckedError - trick
        untilDestroyed(this),
      )
      .subscribe((selectedOrder: Order | undefined) => {
        this.selectedOrder = selectedOrder;

        this._getOrdersInfo();

        this._changeDetectorRef.detectChanges();
      });
  }

  private _getOrdersInfo() {
    if (this.selectedOrder) {
      this.ordersSum = {
        selected:
          this.selectedOrder.sumPriceShown.priceSum +
          (this.selectedOrder.serviceFee?.grossPrice || 0),
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
        .subscribe((activeOrdersCount: number) => {
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
        .subscribe((userActiveOrders: Order[]) => {
          this.userActiveOrders = userActiveOrders;

          this.ordersSum.all = 0;
          this.userActiveOrders.forEach((o: Order) => {
            this.ordersSum.all =
              (this.ordersSum?.all || 0) +
              o.sumPriceShown.priceSum +
              (o.serviceFee?.grossPrice || 0);
          });

          this._changeDetectorRef.detectChanges();
        });
    }
  }

  public editSelectedOrder() {
    this._store.dispatch(
      dashboardActions.setOrderEditing({
        orderEditing: !this.dashboardSettings.orderEditing,
      }),
    );
  }

  public toggleShowAllUserOrders() {
    this._store.dispatch(
      dashboardActions.setShowAllUserOrders({
        showAllUserOrders: !this.dashboardSettings.showAllUserOrders,
      }),
    );
  }

  public print() {
    const dialog = this._nbDialogService.open(OrderPrintComponent, {
      dialogClass: 'print-dialog',
    });

    dialog.componentRef.instance.orders = (
      this.dashboardSettings.showAllUserOrders
        ? this.userActiveOrders
        : [this.selectedOrder]
    ) as Order[];
  }
}
