import { Observable } from 'rxjs';
import { delay, switchMap, take } from 'rxjs/operators';
import { EDashboardListMode, EDashboardSize, ENebularButtonSize } from 'src/app/shared/enums';
import { IOrder } from 'src/app/shared/interfaces';
import { IState } from 'src/app/store';
import { dashboardActions } from 'src/app/store/actions';
import { dashboardSelectors, orderListSelectors } from 'src/app/store/selectors';
import { IDashboardSettings } from 'src/app/store/state';

// import * as printJS from 'print-js';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { OrderPrintComponent } from '../order-print/order-print.component';

@UntilDestroy()
@Component({
  selector: 'app-order-ticket-body',
  templateUrl: './order-ticket-body.component.html',
  styleUrls: ['./order-ticket-body.component.scss'],
})
export class OrderTicketBodyComponent implements OnInit, OnDestroy {
  public dashboardSettings: IDashboardSettings;
  public selectedOrder: IOrder;
  public buttonSize: ENebularButtonSize;
  public ordersSum: any;
  public userActiveOrders: IOrder[];
  public EDashboardListMode = EDashboardListMode;
  public activeOrdersCount: number;

  constructor(private _store: Store<IState>, private _nbDialogService: NbDialogService) {}

  ngOnInit(): void {
    this._store
      .pipe(select(dashboardSelectors.getSettings), untilDestroyed(this))
      .subscribe((dashboardSettings: IDashboardSettings): void => {
        this.dashboardSettings = dashboardSettings;

        this.buttonSize =
          this.dashboardSettings.size === EDashboardSize.LARGER ? ENebularButtonSize.MEDIUM : ENebularButtonSize.SMALL;
      });

    this._store
      .pipe(
        select(dashboardSelectors.getListMode),
        switchMap(
          (listMode: EDashboardListMode): Observable<IOrder> => {
            return this._store.pipe(
              select(
                listMode === EDashboardListMode.CURRENT
                  ? dashboardSelectors.getSelectedActiveOrder()
                  : dashboardSelectors.getSelectedHistoryOrder()
              )
            );
          }
        ),
        delay(0), // ExpressionChangedAfterItHasBeenCheckedError - trick
        untilDestroyed(this)
      )
      .subscribe((selectedOrder: IOrder): void => {
        this.selectedOrder = selectedOrder;

        this._getOrdersInfo();
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
        .pipe(select(orderListSelectors.getActiveOrdersCountByUserId(this.selectedOrder.userId)), take(1))
        .subscribe((activeOrdersCount: number): void => {
          this.activeOrdersCount = activeOrdersCount;
        });

      this._store
        .pipe(select(orderListSelectors.getActiveOrdersByUserId(this.selectedOrder.userId)), take(1))
        .subscribe((userActiveOrders: IOrder[]): void => {
          this.userActiveOrders = userActiveOrders;

          this.ordersSum.all = 0;
          this.userActiveOrders.map((o: IOrder): void => (this.ordersSum.all += o.sumPriceShown.priceSum));
        });
    }
  }

  public editSelectedOrder(): void {
    this._store.dispatch(
      dashboardActions.setOrderEditing({
        orderEditing: !this.dashboardSettings.orderEditing,
      })
    );
  }

  public toggleShowAllUserOrders(): void {
    this._store.dispatch(
      dashboardActions.setShowAllUserOrders({
        showAllUserOrders: !this.dashboardSettings.showAllUserOrders,
      })
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

    dialog.componentRef.instance.orders = this.dashboardSettings.showAllUserOrders
      ? this.userActiveOrders
      : [this.selectedOrder];
  }
}
