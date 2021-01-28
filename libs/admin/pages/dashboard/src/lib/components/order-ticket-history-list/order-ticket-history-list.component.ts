import { take } from 'rxjs/operators';

import { Component, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { dashboardActions, dashboardSelectors } from '@bgap/admin/shared/dashboard';
import { currentStatus as currentStatusFn, ordersSelectors } from '@bgap/admin/shared/orders';
import { customNumberCompare } from '@bgap/admin/shared/utils';
import { IOrder } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-order-ticket-history-list',
  templateUrl: './order-ticket-history-list.component.html',
})
export class OrderTicketHistoryListComponent implements OnDestroy {
  public selectedOrder: IOrder;
  public dailyOrders: IOrder[] = [];
  public dateFormControl: FormControl;
  public currentStatus = currentStatusFn;

  constructor(private _store: Store<any>) {
    this._store
      .pipe(select(dashboardSelectors.getSelectedHistoryDate), take(1))
      .subscribe((historyDate: number): void => {
        this.dateFormControl = new FormControl(
          new Date(historyDate).toISOString().slice(0, 10)
        );
      });

    this._store
      .pipe(
        select(dashboardSelectors.getSelectedHistoryOrder()),
        untilDestroyed(this)
      )
      .subscribe((selectedOrder: IOrder): void => {
        this.selectedOrder = selectedOrder;
      });

    this._store
      .pipe(
        select(ordersSelectors.getAllHistoryOrders),
        untilDestroyed(this)
      )
      .subscribe((historyOrders: IOrder[]): void => {
        this.dailyOrders = historyOrders.sort(customNumberCompare('created'));

        if (!this.selectedOrder) {
          this.selectOrder(this.dailyOrders[0]);
        }
      });

    this.dateFormControl.valueChanges.subscribe((): void => {
      this._store.dispatch(
        dashboardActions.setHistoryDate({
          historyDate: this.dateFormControl.value,
        })
      );
    });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public selectOrder(order: IOrder): void {
    const selectedOrder = this.dailyOrders.find(
      (o): boolean => o._id === order?._id
    );

    this._store.dispatch(
      dashboardActions.setSelectedOrderId({
        orderId: selectedOrder ? selectedOrder._id : undefined,
      })
    );
  }
}
