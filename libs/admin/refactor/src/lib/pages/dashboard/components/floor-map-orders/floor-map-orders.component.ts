import { BehaviorSubject } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import { FloorMapOrderObjects, FloorMapOrders } from '@bgap/shared/types';
import { NbDialogRef } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-floor-map-orders',
  templateUrl: './floor-map-orders.component.html',
  styleUrls: ['./floor-map-orders.component.scss'],
})
export class FloorMapOrdersComponent implements OnInit {
  public tableId!: string;
  public seatId!: string;
  public allOrders$!: BehaviorSubject<FloorMapOrderObjects>;
  public tableOrders?: FloorMapOrders;
  public mode?: string;

  constructor(
    private _nbDialogRef: NbDialogRef<unknown>,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    this.allOrders$
      .pipe(untilDestroyed(this))
      .subscribe((tableOrders: FloorMapOrderObjects) => {
        this.tableOrders =
          this.mode === 'table'
            ? tableOrders[this.tableId]
            : tableOrders[`${this.tableId}.${this.seatId}`];

        this._changeDetectorRef.detectChanges();
      });
  }

  public close() {
    this._nbDialogRef.close();
  }
}
