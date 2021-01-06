import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import { EDashboardSize, EDashboardTicketListType, ENebularButtonSize, EOrderStatus } from 'src/app/shared/enums';
import { IOrder } from 'src/app/shared/interfaces';
import { customNumberCompare } from 'src/app/shared/pure';
import { currentStatus as currentStatusFn } from 'src/app/shared/pure/orders';
import { IState } from 'src/app/store';
import { dashboardActions } from 'src/app/store/actions';
import { dashboardSelectors, orderListSelectors } from 'src/app/store/selectors';
import { IDashboardSettings } from 'src/app/store/state';

import { Component, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'app-order-ticket-list',
  templateUrl: './order-ticket-list.component.html',
  styleUrls: ['./order-ticket-list.component.scss'],
})
export class OrderTicketListComponent implements OnDestroy {
  public selectedOrder: IOrder;
  public dashboardSettings: IDashboardSettings;
  public buttonSize: ENebularButtonSize;

  public EDashboardTicketListType = EDashboardTicketListType;

  public filteredOrders: IOrder[] = [];
  public placedOrders: IOrder[] = [];
  public readyOrders: IOrder[] = [];
  public paymentOrders: IOrder[] = [];

  public uniquePaymentUsersCount: number;
  public uniqueReadyOrdersCount: number;

  private _orders: IOrder[];

  constructor(private _store: Store<IState>) {
    combineLatest([
      this._store.pipe(select(orderListSelectors.getAllActiveOrders), untilDestroyed(this)),
      this._store.pipe(select(dashboardSelectors.getTicketListType), untilDestroyed(this)),
    ]).subscribe(([activeOrders, ticketListType]: [IOrder[], EDashboardTicketListType]): void => {
      this._orders = activeOrders;

      this._refreshPlacedOrders();
      this._refreshReadyOrders();
      this._refreshPaymentOrders();
      this._refreshFilteredOrders(ticketListType);
    });

    this._store
      .pipe(select(dashboardSelectors.getSelectedActiveOrder()), untilDestroyed(this))
      .subscribe((selectedOrder: IOrder): void => {
        this.selectedOrder = selectedOrder;
      });

    this._store
      .pipe(select(dashboardSelectors.getSettings), untilDestroyed(this))
      .subscribe((dashboardSettings: IDashboardSettings): void => {
        this.dashboardSettings = dashboardSettings;

        this.buttonSize =
          this.dashboardSettings.size === EDashboardSize.LARGER ? ENebularButtonSize.MEDIUM : ENebularButtonSize.SMALL;
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _refreshPlacedOrders(): void {
    this.placedOrders = [
      ...this._orders.filter((o: IOrder): boolean => currentStatusFn(o.statusLog) !== EOrderStatus.READY),
    ];
  }

  private _refreshReadyOrders(): void {
    this.readyOrders = [
      ...this._orders.filter((o: IOrder): boolean => currentStatusFn(o.statusLog) === EOrderStatus.READY),
    ];

    this.uniqueReadyOrdersCount = this.readyOrders.filter((v, i, a): boolean => a.indexOf(v) === i).length;
  }

  private _refreshPaymentOrders(): void {
    const uniquePaymentUsers = this._orders
      .filter((o: IOrder): boolean => o.paymentIntention > 0)
      .map((o: IOrder): string => o.userId)
      .filter((v, i, a): boolean => a.indexOf(v) === i); // unique filter

    this.uniquePaymentUsersCount = uniquePaymentUsers.length;
    this.paymentOrders = [...this._orders.filter((o: IOrder): boolean => uniquePaymentUsers.includes(o.userId))];
  }

  private _refreshFilteredOrders(listType: EDashboardTicketListType): void {
    switch (listType) {
      case EDashboardTicketListType.PLACED:
        this.filteredOrders = this.placedOrders.sort(customNumberCompare('created'));
        break;
      case EDashboardTicketListType.READY:
        this.filteredOrders = this.readyOrders;
        break;
      case EDashboardTicketListType.PAYMENT_INTENTION:
        this.filteredOrders = this.paymentOrders.sort(customNumberCompare('paymentIntention'));
        break;
    }

    this._store
      .pipe(select(dashboardSelectors.getSelectedOrderId), take(1))
      .subscribe((selectedOrderId: string): void => {
        const found = this.filteredOrders.map((o): string => o._id).includes(selectedOrderId);

        if (!found) {
          this.selectOrder(this.filteredOrders[0]);
        }
      });
  }

  public selectOrder(order: IOrder): void {
    const selectedOrder = this._orders.find((o): boolean => o._id === order?._id);

    this._store.dispatch(
      dashboardActions.setSelectedOrderId({
        orderId: selectedOrder ? selectedOrder._id : undefined,
      })
    );
  }

  public selectListType(listType: EDashboardTicketListType): void {
    if (this.dashboardSettings.ticketListType !== listType) {
      this._store.dispatch(dashboardActions.resetSelectedOrderId());
    }

    this._store.dispatch(
      dashboardActions.setTicketListType({
        ticketListType: listType,
      })
    );
  }

  public trackByFn(index: number, item: IOrder): string {
    return item._id;
  }
}
