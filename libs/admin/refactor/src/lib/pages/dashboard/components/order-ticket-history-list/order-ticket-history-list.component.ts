import { take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { currentStatus } from '@bgap/crud-gql/api';
import { Order } from '@bgap/domain';
import { customDateCompare, filterNullish } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import {
  dashboardActions,
  dashboardSelectors,
} from '../../../../store/dashboard';
import { OrderHistoryCollectionService } from '../../../../store/orders';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-ticket-history-list',
  templateUrl: './order-ticket-history-list.component.html',
})
export class OrderTicketHistoryListComponent implements OnInit {
  public selectedOrder?: Order;
  public dailyOrders: Order[] = [];
  public dateFormControl: FormControl = new FormControl();
  public currentStatus = currentStatus;

  constructor(
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
    private _orderHistoryCollectionService: OrderHistoryCollectionService,
  ) {}

  ngOnInit() {
    this._store
      .select(dashboardSelectors.getSelectedHistoryDate)
      .pipe(filterNullish(), take(1), untilDestroyed(this))
      .subscribe(historyDate => {
        this.dateFormControl = new FormControl(
          new Date(historyDate).toISOString().slice(0, 10),
        );

        this._store.dispatch(
          dashboardActions.updateSelectedUnitOrderHistory({ historyDate }),
        );

        this._changeDetectorRef.detectChanges();
      });

    this._store
      .pipe(
        select(dashboardSelectors.getSelectedHistoryOrder()),
        untilDestroyed(this),
      )
      .subscribe((selectedOrder: Order | undefined) => {
        this.selectedOrder = selectedOrder;

        this._changeDetectorRef.detectChanges();
      });

    this._orderHistoryCollectionService.entities$
      .pipe(untilDestroyed(this))
      .subscribe((historyOrders: Order[]) => {
        this.dailyOrders = historyOrders.sort(
          customDateCompare('createdAt', true),
        );

        if (!this.selectedOrder) {
          this.selectOrder(this.dailyOrders[0]);
        }

        this._changeDetectorRef.detectChanges();
      });

    this.dateFormControl.valueChanges.subscribe(() => {
      this._store.dispatch(
        dashboardActions.setHistoryDate({
          historyDate: this.dateFormControl.value,
        }),
      );
    });
  }

  public selectOrder(order: Order) {
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
