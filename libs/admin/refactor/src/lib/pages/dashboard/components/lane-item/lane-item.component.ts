import { findLast } from 'lodash/fp';
import { timer } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { OrderStatus, ServingMode, Unit } from '@bgap/domain';
import { ENebularButtonSize, LaneOrderItem } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { OrderService } from '../../../../shared/data-access/order';
import {
  getNextOrderStatus,
  getOrderLaneColor,
  getPrevOrderItemStatus,
} from '../../../../store/orders';
import { productsSelectors } from '../../../../store/products';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-lane-item',
  templateUrl: './lane-item.component.html',
  styleUrls: ['./lane-item.component.scss'],
})
export class LaneItemComponent implements OnInit {
  @Input() orderItem!: LaneOrderItem;
  @Input() buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  @Input() unit?: Unit;
  @Input() testId?: string = '';

  public EServingMode = ServingMode;
  public processingTimer = 0;

  constructor(
    private _store: Store,
    private _orderService: OrderService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
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
        .subscribe((image: string) => {
          this.orderItem.image = image;

          this._changeDetectorRef.detectChanges();
        });
    }

    if (!this.unit) {
      throw new Error('HANDLE ME: unexpected nullish');
    }

    this.orderItem.laneColor = getOrderLaneColor(this.orderItem, this.unit);

    if (this.orderItem.currentStatus === OrderStatus.processing) {
      const lastProcessing = findLast(
        logItem => logItem?.status === OrderStatus.processing,
        this.orderItem.statusLog,
      );

      timer(0, 1000)
        .pipe(untilDestroyed(this))
        .subscribe(() => {
          this.processingTimer = Math.floor(
            (new Date().getTime() - (lastProcessing?.ts || 0)) * 0.001,
          );

          this._changeDetectorRef.detectChanges();
        });
    }

    this._changeDetectorRef.detectChanges();
  }

  public isOrderItemStatus(status: keyof typeof OrderStatus): boolean {
    return this.orderItem.currentStatus === OrderStatus[status];
  }

  public async moveForward(): Promise<void> {
    const nextStatus = getNextOrderStatus(this.orderItem?.currentStatus);

    if (
      nextStatus &&
      !isNaN(Number(this.orderItem.idx)) &&
      this.orderItem.orderId
    ) {
      await this._orderService
        .updateOrderItemStatus$(
          this.orderItem.orderId,
          nextStatus,
          Number(this.orderItem.idx),
        )
        .toPromise();
    }
  }

  public async moveBack(): Promise<void> {
    const prevStatus = getPrevOrderItemStatus(this.orderItem?.currentStatus);

    if (
      prevStatus &&
      !isNaN(Number(this.orderItem.idx)) &&
      this.orderItem.orderId
    ) {
      await this._orderService
        .updateOrderItemStatus$(
          this.orderItem.orderId,
          prevStatus,
          Number(this.orderItem.idx),
        )
        .toPromise();
    }
  }
}
