import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { productsSelectors } from '@bgap/admin/shared/data-access/products';
import { OrderService } from '@bgap/admin/shared/data-access/data';
import {
  currentStatus as currentStatusFn, getNextOrderItemStatus, getOrderLaneColor, getPrevOrderItemStatus
} from '@bgap/admin/shared/data-access/orders';
import { objectToArray } from '@bgap/shared/utils';
import {
  ENebularButtonSize,
  EOrderStatus,
  ILaneOrderItem,
  IStatusLogItem,
  IUnit,
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-lane-item',
  templateUrl: './lane-item.component.html',
  styleUrls: ['./lane-item.component.scss'],
})
export class LaneItemComponent implements OnInit, OnDestroy {
  @Input() orderItem!: ILaneOrderItem;
  @Input() buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  @Input() unit!: IUnit;

  public currentStatus = currentStatusFn;
  public EOrderStatus = EOrderStatus;
  public processingTimer = 0;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _orderService: OrderService
  ) {}

  ngOnInit(): void {
    this._store
      .pipe(
        select(
          productsSelectors.getGeneratedProductImageById(
            this.orderItem.productId
          )
        ),
        take(1)
      )
      .subscribe((image: string): void => {
        this.orderItem.image = image;
      });

    this.orderItem.laneColor = getOrderLaneColor(this.orderItem, this.unit);

    if (this.orderItem.currentStatus === EOrderStatus.PROCESSING) {
      const processingInfo = (<IStatusLogItem[]>objectToArray(this.orderItem.statusLog, 'ts'))
        .reverse() // <-- Find the LAST processing status
        .find(
          (t: IStatusLogItem): boolean => t.status === EOrderStatus.PROCESSING
        );

      timer(0, 1000)
        .pipe(untilDestroyed(this))
        .subscribe((): void => {
          this.processingTimer = Math.floor(
            (new Date().getTime() - parseInt(<string>(<IStatusLogItem>processingInfo).ts, 10)) * 0.001
          );
        });
    }
  }


  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public moveForward(): void {
    this._orderService.updateOrderItemStatus(
      this.orderItem?.orderId || '',
      <EOrderStatus>getNextOrderItemStatus(<EOrderStatus>this.orderItem?.currentStatus),
      <number>this.orderItem.idx
    );
  }

  public moveBack(): void {
    this._orderService.updateOrderItemStatus(
      <string>(<ILaneOrderItem>this.orderItem).orderId,
      <EOrderStatus>getPrevOrderItemStatus(<EOrderStatus>this.orderItem?.currentStatus),
      <number>this.orderItem.idx
    );
  }
}
