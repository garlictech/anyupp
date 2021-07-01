import { combineLatest } from 'rxjs';
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
import { DataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import {
  currentStatus as currentStatusFn,
  ordersSelectors,
} from '@bgap/admin/shared/data-access/orders';
import * as CrudApi from '@bgap/crud-gql/api';
import { customNumberCompare } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-ticket-history-list',
  templateUrl: './order-ticket-history-list.component.html',
})
export class OrderTicketHistoryListComponent implements OnInit, OnDestroy {
  public selectedOrder?: CrudApi.Order;
  public dailyOrders: CrudApi.Order[] = [];
  public dateFormControl: FormControl = new FormControl();
  public currentStatus = currentStatusFn;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
    private _dataService: DataService,
  ) {}

  ngOnInit(): void {
    combineLatest([
      this._store.pipe(
        select(dashboardSelectors.getSelectedHistoryDate),
        take(1),
      ),
      this._store.pipe(select(loggedUserSelectors.getSelectedUnitId), take(1)),
    ]).subscribe(
      ([hDate, unitId]: [number, string | null | undefined]): void => {
        this.dateFormControl = new FormControl(
          new Date(hDate).toISOString().slice(0, 10),
        );

        if (hDate && unitId) {
          this._dataService
            .listHistoryQuery(unitId, this.dateFormControl.value)
            .subscribe();
        }

        this._changeDetectorRef.detectChanges();
      },
    );

    this._store
      .pipe(
        select(dashboardSelectors.getSelectedHistoryOrder()),
        untilDestroyed(this),
      )
      .subscribe((selectedOrder: CrudApi.Order | undefined): void => {
        this.selectedOrder = selectedOrder;

        this._changeDetectorRef.detectChanges();
      });

    this._store
      .pipe(select(ordersSelectors.getAllHistoryOrders), untilDestroyed(this))
      .subscribe((historyOrders: CrudApi.Order[]): void => {
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

  public selectOrder(order: CrudApi.Order): void {
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
