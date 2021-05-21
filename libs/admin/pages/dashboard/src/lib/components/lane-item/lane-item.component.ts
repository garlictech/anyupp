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
import { OrderService } from '@bgap/admin/shared/data-access/data';
import {
  currentStatus as currentStatusFn,
  getNextOrderStatus,
  getOrderLaneColor,
  getPrevOrderItemStatus,
} from '@bgap/admin/shared/data-access/orders';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import { CrudApi } from '@bgap/crud-gql/api';
import {
  ENebularButtonSize,
  ILaneOrderItem,
  IStatusLog,
  IUnit,
} from '@bgap/shared/types';
import { objectToArray } from '@bgap/shared/utils';
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
  @Input() unit!: IUnit;

  public currentStatus = currentStatusFn;
  public EOrderStatus = CrudApi.OrderStatus;
  public processingTimer = 0;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
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

    this.orderItem.laneColor = getOrderLaneColor(this.orderItem, this.unit);

    if (this.orderItem.currentStatus === CrudApi.OrderStatus.PROCESSING) {
      const processingInfo = (<IStatusLog[]>(
        objectToArray(this.orderItem.statusLog, 'ts')
      ))
        .reverse() // <-- Find the LAST processing status
        .find(
          (t: IStatusLog): boolean =>
            t.status === CrudApi.OrderStatus.PROCESSING,
        );

      timer(0, 1000)
        .pipe(untilDestroyed(this))
        .subscribe((): void => {
          this.processingTimer = Math.floor(
            new Date().getTime() - (processingInfo?.ts || 0) * 0.001,
          );
        });
    }

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public moveForward(): void {
    this._orderService.updateOrderItemStatus(
      this.orderItem?.orderId || '',
      <CrudApi.OrderStatus>(
        getNextOrderStatus(<CrudApi.OrderStatus>this.orderItem?.currentStatus)
      ),
      <number>this.orderItem.idx,
    );

    this._changeDetectorRef.detectChanges();
  }

  public moveBack(): void {
    const prevStatus = this.orderItem?.currentStatus
      ? getPrevOrderItemStatus(this.orderItem?.currentStatus)
      : undefined;

    if (prevStatus) {
      this._orderService.updateOrderItemStatus(
        <string>(<ILaneOrderItem>this.orderItem).orderId,
        prevStatus,
        <number>this.orderItem.idx,
      );
    }

    this._changeDetectorRef.detectChanges();
  }
}
