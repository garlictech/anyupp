import { defer, EMPTY, iif, of } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { CrudSdkService } from '../../../../../shared/data-access/sdk';
import { catchGqlError } from '../../../../../store/app-core';
import { loggedUserSelectors } from '../../../../../store/logged-user';
import {
  getNextOrderStatus,
  OrderCollectionService,
  OrderHistoryCollectionService,
} from '../../../../../store/orders';
import * as CrudApi from '@bgap/crud-gql/api';

import {
  archiveOrder,
  recallOrderFromHistory,
  updateOrderItemStatus,
  updateOrderPaymentMode,
  updateOrderStatus,
  updateOrderStatusFromNoneToPlaced,
  updateOrderTransactionStatus,
} from '../../../../orders';
import { DateIntervals } from '@bgap/shared/types';
import { filterNullish, getDayIntervals } from '@bgap/shared/utils';
import { select, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private _adminUser?: CrudApi.AdminUser;

  constructor(
    private _store: Store,
    private _crudSdk: CrudSdkService,
    private _orderCollectionService: OrderCollectionService,
    private _orderHistoryCollectionService: OrderHistoryCollectionService,
  ) {
    this._store
      .pipe(select(loggedUserSelectors.getLoggedUser))
      .subscribe(adminUser => {
        this._adminUser = adminUser;
      });
  }

  private _getDeps = () => ({
    crudSdk: this._crudSdk.sdk,
    timestamp: () => new Date().getTime(),
  });

  private _updateOrderStatusFromNoneToPlaced$(orderId: string) {
    if (this._adminUser?.id) {
      return updateOrderStatusFromNoneToPlaced(this._getDeps())(
        orderId,
        this._adminUser.id,
      );
    } else {
      return EMPTY;
    }
  }

  private _updateOrderTransactionStatus$(
    order: CrudApi.Order,
    status: CrudApi.PaymentStatus,
    unpayCategory?: CrudApi.UnpayCategory,
  ) {
    if (order.transactionId) {
      return updateOrderTransactionStatus(this._getDeps())(
        order.id,
        order.transactionId,
        status,
        unpayCategory,
      );
    } else {
      return EMPTY;
    }
  }

  private _archiveOrder$(orderId: string) {
    return archiveOrder(this._getDeps())(orderId).pipe(
      filterNullish(),
      tap(() => {
        this._orderCollectionService.removeOneFromCache(orderId);
      }),
    );
  }

  public updateOrderPaymentMode$(
    orderId: string,
    paymentMode: CrudApi.PaymentMode,
  ) {
    return updateOrderPaymentMode(this._getDeps())(orderId, paymentMode);
  }

  public rejectOrder$(orderId: string) {
    if (this._adminUser?.id) {
      return updateOrderStatus(this._getDeps())(
        orderId,
        CrudApi.OrderStatus.rejected,
        this._adminUser.id,
      ).pipe(switchMap(() => this._archiveOrder$(orderId)));
    } else {
      return EMPTY;
    }
  }

  public handleOrderStatusChange$(order: CrudApi.Order) {
    const currentStatus = CrudApi.currentStatus(order.statusLog);

    return iif(
      () => currentStatus === CrudApi.OrderStatus.none,
      this._updateOrderStatusFromNoneToPlaced$(order.id),
      defer(() => {
        const status = getNextOrderStatus(currentStatus);

        if (status && this._adminUser?.id) {
          return updateOrderStatus(this._getDeps())(
            order.id,
            status,
            this._adminUser.id,
          ).pipe(
            switchMap(() =>
              iif(
                () =>
                  status === CrudApi.OrderStatus.served &&
                  (order.transactionStatus === CrudApi.PaymentStatus.success ||
                    order.transactionStatus === CrudApi.PaymentStatus.failed),
                defer(() => this._archiveOrder$(order.id)),
                of(true),
              ),
            ),
          );
        } else {
          return EMPTY;
        }
      }),
    );
  }

  public handleSuccessfulTransactionStatus$(
    order: CrudApi.Order,
    paymentStatus: CrudApi.PaymentStatus,
  ) {
    return this._updateOrderTransactionStatus$(order, paymentStatus).pipe(
      catchGqlError(this._store),
      switchMap(() => {
        const currentStatus = CrudApi.currentStatus(order.statusLog);

        return iif(
          () => currentStatus === CrudApi.OrderStatus.none,
          defer(() => this._updateOrderStatusFromNoneToPlaced$(order.id)),
          iif(
            () => currentStatus === CrudApi.OrderStatus.served,
            defer(() => this._archiveOrder$(order.id)),
            of(true),
          ),
        );
      }),
    );
  }

  public handleFailedTransactionStatus$(
    order: CrudApi.Order,
    paymentStatus: CrudApi.PaymentStatus,
    unpayCategory: CrudApi.UnpayCategory,
  ) {
    return this._updateOrderTransactionStatus$(
      order,
      paymentStatus,
      unpayCategory,
    ).pipe(
      catchGqlError(this._store),
      switchMap(() => {
        const currentStatus = CrudApi.currentStatus(order.statusLog);

        return iif(
          () => currentStatus === CrudApi.OrderStatus.served,
          defer(() => this._archiveOrder$(order.id)),
          of(true),
        );
      }),
    );
  }

  public updateOrderItemStatus$(
    orderId: string,
    status: CrudApi.OrderStatus,
    idx: number,
  ) {
    if (this._adminUser?.id) {
      return updateOrderItemStatus(this._getDeps())(
        orderId,
        idx,
        status,
        this._adminUser?.id,
      ).pipe(
        filterNullish(),
        switchMap((order: CrudApi.Order) =>
          iif(
            () =>
              CrudApi.currentStatus(order.statusLog) ===
                CrudApi.OrderStatus.served &&
              (order.transactionStatus === CrudApi.PaymentStatus.success ||
                order.transactionStatus === CrudApi.PaymentStatus.failed),
            defer(() => this._archiveOrder$(order.id)),
            of(true),
          ),
        ),
      );
    } else {
      return EMPTY;
    }
  }

  public recallOrderFromHistory$(orderId: string) {
    if (this._adminUser?.id) {
      return recallOrderFromHistory(this._getDeps())(
        orderId,
        this._adminUser?.id,
      ).pipe(
        catchGqlError(this._store),
        tap(() => {
          this._orderHistoryCollectionService.removeOneFromCache(orderId);
        }),
      );
    } else {
      return EMPTY;
    }
  }

  public listHistoryQuery(
    unitId: string,
    historyDate: string | number,
    timeZone: string,
  ) {
    const dayIntervals: DateIntervals = getDayIntervals(historyDate, timeZone);

    this._orderHistoryCollectionService.clearCache();
    this._orderHistoryCollectionService
      .getAllCachedPaginatedData$({
        filter: {
          unitId: { eq: unitId },
          archived: { eq: true },
          createdAt: {
            gte: new Date(dayIntervals.from).toISOString(),
            lte: new Date(dayIntervals.to).toISOString(),
          },
        },
      })
      .subscribe();
  }
}
