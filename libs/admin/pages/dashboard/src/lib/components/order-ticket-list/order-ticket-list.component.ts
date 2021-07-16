import { combineLatest } from 'rxjs';
import { take } from 'rxjs/operators';
import * as CrudApi from '@bgap/crud-gql/api';
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

import {
  EDashboardSize,
  EDashboardTicketListType,
  ENebularButtonSize,
} from '@bgap/shared/types';
import { customDateCompare, customNumberCompare } from '@bgap/shared/utils';
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
  public selectedOrder?: CrudApi.Order;
  public dashboardSettings!: IDashboardSettings;
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;

  public EDashboardTicketListType = EDashboardTicketListType;

  public filteredOrders: CrudApi.Order[] = [];
  public placedOrders: CrudApi.Order[] = [];
  public manualPaymentOrders: CrudApi.Order[] = [];
  public problematicOrders: CrudApi.Order[] = [];

  public uniquePaymentUsersCount = 0;
  public uniqueReadyOrdersCount = 0;

  private _orders: CrudApi.Order[] = [];

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store,
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
        CrudApi.Order[],
        EDashboardTicketListType,
      ]): void => {
        this._orders = activeOrders;

        this._refreshPlacedOrders();
        this._refreshManualPaymentOrders();
        this._refreshProblematicOrders();
        this._refreshFilteredOrders(ticketListType);

        this._changeDetectorRef.detectChanges();
      },
    );

    this._store
      .pipe(
        select(dashboardSelectors.getSelectedActiveOrder()),
        untilDestroyed(this),
      )
      .subscribe((selectedOrder: CrudApi.Order | undefined): void => {
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
    // 1. tab: minden ami processed és served között státuszban van
    this.placedOrders = [
      ...this._orders.filter(
        (o: CrudApi.Order): boolean =>
          ![
            CrudApi.OrderStatus.served,
            CrudApi.OrderStatus.none,
            CrudApi.OrderStatus.rejected,
          ].includes(currentStatusFn(o.statusLog)),
      ),
    ];
  }

  private _refreshManualPaymentOrders(): void {
    // 2. tab: cash vagy card fizetéssel jelölt nem success fizetés
    // és nem rejected order bármilyen státusszal (ezekhez megy a fizetőpincér,
    // és ezek között lehet olyan, ami már az első tabon is szerepel)
    this.manualPaymentOrders = [
      ...this._orders.filter(
        (o: CrudApi.Order): boolean =>
          (o.paymentMode.method === CrudApi.PaymentMethod.card ||
            o.paymentMode.method === CrudApi.PaymentMethod.cash) &&
          o.transaction?.status !== CrudApi.PaymentStatus.success &&
          o.transaction?.status !== CrudApi.PaymentStatus.failed &&
          currentStatusFn(o.statusLog) !== CrudApi.OrderStatus.rejected,
      ),
    ];
  }

  private _refreshProblematicOrders(): void {
    // 3. tab: NONE status, nem sikeres fizetés, (nem rejected order) -
    // 3 tab gyakorlatilag a problémás vagy szemét orderek, amikben lehet így turkálni
    this.problematicOrders = [
      ...this._orders.filter(
        (o: CrudApi.Order): boolean =>
          currentStatusFn(o.statusLog) === CrudApi.OrderStatus.none &&
          o.transaction?.status !== CrudApi.PaymentStatus.success,
      ),
    ];
  }

  private _refreshFilteredOrders(listType: EDashboardTicketListType): void {
    switch (listType) {
      case EDashboardTicketListType.placed:
        this.filteredOrders = this.placedOrders.sort(
          customDateCompare('createdAt'),
        );
        break;
      case EDashboardTicketListType.manual:
        this.filteredOrders = this.manualPaymentOrders;
        break;
      case EDashboardTicketListType.problematic:
        this.filteredOrders = this.problematicOrders.sort(
          customNumberCompare('paymentIntention'),
        );
        break;
    }

    if (this.filteredOrders.length === 0) {
      this._store.dispatch(dashboardActions.resetSelectedOrderId());
    }
  }

  private _selectFirstItem() {
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

  public selectOrder(order: CrudApi.Order): void {
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

    this._selectFirstItem();
  }

  public trackByFn(_index: number, item: CrudApi.Order): string {
    return item.id;
  }
}
