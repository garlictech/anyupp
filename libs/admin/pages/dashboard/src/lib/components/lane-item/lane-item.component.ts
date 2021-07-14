import { findLast } from 'lodash/fp';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { OrderService } from '@bgap/admin/shared/data-access/order';
import {
  currentStatus as currentStatusFn,
  getNextOrderStatus,
  getOrderLaneColor,
  getPrevOrderItemStatus,
} from '@bgap/admin/shared/data-access/orders';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import * as CrudApi from '@bgap/crud-gql/api';
import { ENebularButtonSize, ILaneOrderItem } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-lane-item',
  templateUrl: './lane-item.component.html',
  styleUrls: ['./lane-item.component.scss'],
})
export class LaneItemComponent implements OnInit, OnDestroy {
  @Input() orderItem!: ILaneOrderItem;
  @Input() buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  @Input() unit?: CrudApi.Unit;

  public currentStatus = currentStatusFn;
  public EOrderStatus = CrudApi.OrderStatus;
  public processingTimer = 0;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store,
    private _orderService: OrderService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    if (this.orderItem.productId) {
      this._store
        .pipe(
          select(
            productsSelectors.getGeneratedProductImageById(
              this.orderItem.productId,
            ),
          ),
          take(1),
        )
        .subscribe((image: string): void => {
          this.orderItem.image = image;

          this._changeDetectorRef.detectChanges();
        });
    }

    if (!this.unit) {
      throw new Error('HANDLE ME: unexpected nullish');
    }

    this.orderItem.laneColor = getOrderLaneColor(this.orderItem, this.unit);

    if (this.orderItem.currentStatus === CrudApi.OrderStatus.processing) {
      const lastProcessing = findLast(
        logItem => logItem?.status === CrudApi.OrderStatus.processing,
        this.orderItem.statusLog,
      );

      timer(0, 1000)
        .pipe(untilDestroyed(this))
        .subscribe((): void => {
          this.processingTimer = Math.floor(
            (new Date().getTime() - (lastProcessing?.ts || 0)) * 0.001,
          );

          this._changeDetectorRef.detectChanges();
        });
    }

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public isOrderItemStatus(status: keyof typeof CrudApi.OrderStatus): boolean {
    return this.orderItem.currentStatus === CrudApi.OrderStatus[status];
  }

  public moveForward(): void {
    const nextStatus = this.orderItem?.currentStatus
      ? getNextOrderStatus(this.orderItem?.currentStatus)
      : undefined;

    if (
      nextStatus &&
      !isNaN(Number(this.orderItem.idx)) &&
      this.orderItem.orderId
    ) {
      this._orderService
        .updateOrderItemStatus(
          this.orderItem.orderId,
          nextStatus,
          Number(this.orderItem.idx),
        )
        .subscribe();
    }

    this._changeDetectorRef.detectChanges();
  }

  public moveBack(): void {
    const prevStatus = this.orderItem?.currentStatus
      ? getPrevOrderItemStatus(this.orderItem?.currentStatus)
      : undefined;

    if (
      prevStatus &&
      !isNaN(Number(this.orderItem.idx)) &&
      this.orderItem.orderId
    ) {
      this._orderService
        .updateOrderItemStatus(
          this.orderItem.orderId,
          prevStatus,
          Number(this.orderItem.idx),
        )
        .subscribe();
    }

    this._changeDetectorRef.detectChanges();
  }
}
