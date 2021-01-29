import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { productsSelectors } from '@bgap/admin/shared/products';
import { OrderService } from '@bgap/admin/shared/data';
import {
  currentStatus as currentStatusFn, getNextOrderItemStatus, getOrderLaneColor, getPrevOrderItemStatus
} from '@bgap/admin/shared/orders';
import { objectToArray } from '@bgap/admin/shared/utils';
import { ENebularButtonSize, EOrderStatus, ILaneOrderItem, IStatusLogItem, IUnit } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-lane-item',
  templateUrl: './lane-item.component.html',
  styleUrls: ['./lane-item.component.scss'],
})
export class LaneItemComponent implements OnInit, OnDestroy {
  @Input() orderItem: ILaneOrderItem;
  @Input() buttonSize: ENebularButtonSize;
  @Input() unit: IUnit;

  public currentStatus = currentStatusFn;
  public EOrderStatus = EOrderStatus;
  public processingTimer = 0;

  constructor(
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
      const processingInfo = objectToArray(this.orderItem.statusLog, 'ts')
        .reverse() // <-- Find the LAST processing status
        .find(
          (t: IStatusLogItem): boolean => t.status === EOrderStatus.PROCESSING
        );

      timer(0, 1000)
        .pipe(untilDestroyed(this))
        .subscribe((): void => {
          this.processingTimer = Math.floor(
            (new Date().getTime() - parseInt(processingInfo.ts, 10)) * 0.001
          );
        });
    }
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public moveForward(): void {
    this._orderService.updateOrderItemStatus(
      this.orderItem.orderId,
      getNextOrderItemStatus(this.orderItem.currentStatus),
      this.orderItem.idx
    );
  }

  public moveBack(): void {
    this._orderService.updateOrderItemStatus(
      this.orderItem.orderId,
      getPrevOrderItemStatus(this.orderItem.currentStatus),
      this.orderItem.idx
    );
  }
}
