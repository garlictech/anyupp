import { BehaviorSubject } from 'rxjs';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  IFloorMapTableOrderObjects,
  IFloorMapTableOrders,
} from '@bgap/shared/types';
import { NbDialogRef } from '@nebular/theme';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-floor-map-orders',
  templateUrl: './floor-map-orders.component.html',
  styleUrls: ['./floor-map-orders.component.scss'],
})
export class FloorMapOrdersComponent implements OnInit {
  public tableId!: string;
  public seatId!: string;
  public allTableOrders$!: BehaviorSubject<IFloorMapTableOrderObjects>;
  public tableOrders?: IFloorMapTableOrders;

  constructor(
    private _nbDialogRef: NbDialogRef<unknown>,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    this.allTableOrders$
      .pipe()
      .subscribe((tableOrders: IFloorMapTableOrderObjects): void => {
        this.tableOrders = tableOrders[`${this.tableId}.${this.seatId}`];

        this._changeDetectorRef.detectChanges();
      });
  }

  public close(): void {
    this._nbDialogRef.close();
  }
}
