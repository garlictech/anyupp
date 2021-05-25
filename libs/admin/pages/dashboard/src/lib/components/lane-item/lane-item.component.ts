import { timer } from 'rxjs';
import { take } from 'rxjs/operators';
import * as fp from 'lodash/fp';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import { OrderService } from '@bgap/admin/shared/data-access/data';
import {
  currentStatus as currentStatusFn,
  getNextOrderItemStatus,
  getOrderLaneColor,
  getPrevOrderItemStatus,
} from '@bgap/admin/shared/data-access/orders';
import { ENebularButtonSize, ILaneOrderItem } from '@bgap/shared/types';
import * as CrudApi from '@bgap/crud-gql/api';
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
  public processingTimer = 0;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store,
    private _orderService: OrderService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
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

    if (!this.unit) {
      throw new Error('HANDLE ME: unexpected nullish');
    }

    this.orderItem.laneColor = getOrderLaneColor(this.orderItem, this.unit);

    if (this.orderItem.currentStatus === CrudApi.OrderStatus.processing) {
      const lastProcessing = fp.findLast(
        logItem => logItem.status === CrudApi.OrderStatus.processing,
        this.orderItem.statusLog,
      );

      timer(0, 1000)
        .pipe(untilDestroyed(this))
        .subscribe((): void => {
          this.processingTimer = Math.floor(
            new Date().getTime() - (lastProcessing?.ts || 0) * 0.001,
          );
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
    this._orderService.updateOrderItemStatus(
      this.orderItem?.orderId || '',
      <CrudApi.OrderStatus>(
        getNextOrderItemStatus(
          <CrudApi.OrderStatus>this.orderItem?.currentStatus,
        )
      ),
      <number>this.orderItem.idx,
    );

    this._changeDetectorRef.detectChanges();
  }

  public moveBack(): void {
    this._orderService.updateOrderItemStatus(
      <string>(<ILaneOrderItem>this.orderItem).orderId,
      <CrudApi.OrderStatus>(
        getPrevOrderItemStatus(
          <CrudApi.OrderStatus>this.orderItem?.currentStatus,
        )
      ),
      <number>this.orderItem.idx,
    );

    this._changeDetectorRef.detectChanges();
  }
}
