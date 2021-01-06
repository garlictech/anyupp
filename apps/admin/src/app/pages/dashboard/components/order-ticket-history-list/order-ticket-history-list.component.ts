import { IDateIntervals, IOrder } from 'src/app/shared/interfaces';
import { getDayIntervals } from 'src/app/shared/pure/forms';
import { currentStatus as currentStatusFn } from 'src/app/shared/pure/orders';
import { IState } from 'src/app/store';
import { dashboardActions } from 'src/app/store/actions';
import { dashboardSelectors, orderListSelectors } from 'src/app/store/selectors';

import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { customNumberCompare } from 'src/app/shared/pure';

@UntilDestroy()
@Component({
  selector: 'app-order-ticket-history-list',
  templateUrl: './order-ticket-history-list.component.html',
})
export class OrderTicketHistoryListComponent implements OnDestroy {
  public selectedOrder: IOrder;
  public dailyOrders: IOrder[] = [];
  public dateFormControl: FormControl;

  public currentStatus = currentStatusFn;

  private _orders: IOrder[];
  private _dateIntervals: IDateIntervals;

  constructor(private _store: Store<IState>) {
    this.dateFormControl = new FormControl(new Date().toISOString().slice(0, 10));
    this._refresDayIntervals();

    this._store
      .pipe(select(dashboardSelectors.getSelectedHistoryOrder()), untilDestroyed(this))
      .subscribe((selectedOrder: IOrder): void => {
        this.selectedOrder = selectedOrder;
      });

    this._store
      .pipe(select(orderListSelectors.getAllHistoryOrders), untilDestroyed(this))
      .subscribe((historyOrders: IOrder[]): void => {
        this._orders = historyOrders.sort(customNumberCompare('created'));

        this._refreshDailyOrders(!this.selectedOrder);
      });

    this.dateFormControl.valueChanges.subscribe((val): void => {
      this._refresDayIntervals();
      this._refreshDailyOrders(true);
    });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _refreshDailyOrders(selectFirstItem: boolean = false): void {
    this.dailyOrders = this._orders.filter(
      (o: IOrder): boolean => o.created >= this._dateIntervals.from && o.created <= this._dateIntervals.to
    );

    if (selectFirstItem) {
      this.selectOrder(this.dailyOrders[0]);
    }
  }

  private _refresDayIntervals(): void {
    this._dateIntervals = getDayIntervals(this.dateFormControl.value);
  }

  public selectOrder(order: IOrder): void {
    const selectedOrder = this._orders.find((o): boolean => o._id === order?._id);

    this._store.dispatch(
      dashboardActions.setSelectedOrderId({
        orderId: selectedOrder ? selectedOrder._id : undefined,
      })
    );
  }
}
