import { take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import {
  dashboardActions,
  dashboardSelectors,
} from '@bgap/admin/shared/data-access/dashboard';
import {
  currentStatus as currentStatusFn,
  ordersSelectors,
} from '@bgap/admin/shared/data-access/orders';
import { customNumberCompare } from '@bgap/shared/utils';
import { IOrder } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-ticket-history-list',
  templateUrl: './order-ticket-history-list.component.html',
})
export class OrderTicketHistoryListComponent implements OnInit, OnDestroy {
  public selectedOrder?: IOrder;
  public dailyOrders: IOrder[] = [];
  public dateFormControl: FormControl = new FormControl();
  public currentStatus = currentStatusFn;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(
    private _store: Store<any>,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this._store
      .pipe(select(dashboardSelectors.getSelectedHistoryDate), take(1))
      .subscribe((historyDate: number): void => {
        this.dateFormControl = new FormControl(
          new Date(historyDate).toISOString().slice(0, 10),
        );

        this._changeDetectorRef.detectChanges();
      });

    this._store
      .pipe(
        select(dashboardSelectors.getSelectedHistoryOrder()),
        untilDestroyed(this),
      )
      .subscribe((selectedOrder: IOrder | undefined): void => {
        this.selectedOrder = selectedOrder;

        this._changeDetectorRef.detectChanges();
      });

    this._store
      .pipe(select(ordersSelectors.getAllHistoryOrders), untilDestroyed(this))
      .subscribe((historyOrders: IOrder[]): void => {
        this.dailyOrders = historyOrders.sort(customNumberCompare('created'));

        if (!this.selectedOrder) {
          this.selectOrder(this.dailyOrders[0]);
        }

        this._changeDetectorRef.detectChanges();
      });

    this.dateFormControl.valueChanges.subscribe((): void => {
      this._store.dispatch(
        dashboardActions.setHistoryDate({
          historyDate: this.dateFormControl?.value,
        }),
      );
    });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public selectOrder(order: IOrder): void {
    const selectedOrder = this.dailyOrders.find(
      (o): boolean => o.id === order?.id,
    );

    this._store.dispatch(
      dashboardActions.setSelectedOrderId({
        orderId: selectedOrder ? selectedOrder.id : undefined,
      }),
    );
  }
}
