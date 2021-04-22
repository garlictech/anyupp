import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';

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
import {
  currentStatus as currentStatusFn,
  ordersSelectors,
} from '@bgap/admin/shared/data-access/orders';
import { customNumberCompare } from '@bgap/shared/utils';
import {
  EDashboardSize,
  EDashboardTicketListType,
  ENebularButtonSize,
  EOrderStatus,
  IOrder,
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-order-ticket-list',
  templateUrl: './order-ticket-list.component.html',
  styleUrls: ['./order-ticket-list.component.scss'],
})
export class OrderTicketListComponent implements OnInit, OnDestroy {
  public selectedOrder?: IOrder;
  public dashboardSettings!: IDashboardSettings;
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;

  public EDashboardTicketListType = EDashboardTicketListType;

  public filteredOrders: IOrder[] = [];
  public placedOrders: IOrder[] = [];
  public readyOrders: IOrder[] = [];
  public paymentOrders: IOrder[] = [];

  public uniquePaymentUsersCount = 0;
  public uniqueReadyOrdersCount = 0;

  private _orders: IOrder[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(
    private _store: Store<any>,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    combineLatest([
      this._store.pipe(
        select(ordersSelectors.getAllActiveOrders),
        untilDestroyed(this),
      ),
      this._store.pipe(
        select(dashboardSelectors.getTicketListType),
        untilDestroyed(this),
      ),
    ]).subscribe(
      ([activeOrders, ticketListType]: [
        IOrder[],
        EDashboardTicketListType,
      ]): void => {
        this._orders = activeOrders;

        this._refreshPlacedOrders();
        this._refreshReadyOrders();
        this._refreshPaymentOrders();
        this._refreshFilteredOrders(ticketListType);

        this._changeDetectorRef.detectChanges();
      },
    );

    this._store
      .pipe(
        select(dashboardSelectors.getSelectedActiveOrder()),
        untilDestroyed(this),
      )
      .subscribe((selectedOrder: IOrder | undefined): void => {
        this.selectedOrder = selectedOrder;

        this._changeDetectorRef.detectChanges();
      });

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
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _refreshPlacedOrders(): void {
    this.placedOrders = [
      ...this._orders.filter(
        (o: IOrder): boolean =>
          currentStatusFn(o.statusLog) !== EOrderStatus.READY,
      ),
    ];
  }

  private _refreshReadyOrders(): void {
    this.readyOrders = [
      ...this._orders.filter(
        (o: IOrder): boolean =>
          currentStatusFn(o.statusLog) === EOrderStatus.READY,
      ),
    ];

    this.uniqueReadyOrdersCount = this.readyOrders.filter(
      (v, i, a): boolean => a.indexOf(v) === i,
    ).length;
  }

  private _refreshPaymentOrders(): void {
    const uniquePaymentUsers = this._orders
      .filter((o: IOrder): boolean => (o.paymentIntention || 0) > 0)
      .map((o: IOrder): string => o.userId)
      .filter((v, i, a): boolean => a.indexOf(v) === i); // unique filter

    this.uniquePaymentUsersCount = uniquePaymentUsers.length;
    this.paymentOrders = [
      ...this._orders.filter((o: IOrder): boolean =>
        uniquePaymentUsers.includes(o.userId),
      ),
    ];
  }

  private _refreshFilteredOrders(listType: EDashboardTicketListType): void {
    switch (listType) {
      case EDashboardTicketListType.PLACED:
        this.filteredOrders = this.placedOrders.sort(
          customNumberCompare('created'),
        );
        break;
      case EDashboardTicketListType.READY:
        this.filteredOrders = this.readyOrders;
        break;
      case EDashboardTicketListType.PAYMENT_INTENTION:
        this.filteredOrders = this.paymentOrders.sort(
          customNumberCompare('paymentIntention'),
        );
        break;
    }

    this._store
      .pipe(select(dashboardSelectors.getSelectedOrderId), take(1))
      .subscribe((selectedOrderId: string | undefined): void => {
        const found = this.filteredOrders
          .map((o): string => o.id)
          .includes(selectedOrderId || '');

        if (!found) {
          this.selectOrder(this.filteredOrders[0]);
        }
      });
  }

  public selectOrder(order: IOrder): void {
    const selectedOrder = this._orders.find((o): boolean => o.id === order?.id);

    this._store.dispatch(
      dashboardActions.setSelectedOrderId({
        orderId: selectedOrder ? selectedOrder.id : undefined,
      }),
    );
  }

  public selectListType(listType: EDashboardTicketListType): void {
    if (this.dashboardSettings.ticketListType !== listType) {
      this._store.dispatch(dashboardActions.resetSelectedOrderId());
    }

    this._store.dispatch(
      dashboardActions.setTicketListType({
        ticketListType: listType,
      }),
    );
  }

  public trackByFn(index: number, item: IOrder): string {
    return item.id;
  }
}
