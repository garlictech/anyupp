import { BehaviorSubject } from 'rxjs';

import { Component, OnInit } from '@angular/core';
import { IFloorMapTableOrderObjects, IFloorMapTableOrders } from '@bgap/shared/types';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'bgap-floor-map-orders',
  templateUrl: './floor-map-orders.component.html',
  styleUrls: ['./floor-map-orders.component.scss']
})
export class FloorMapOrdersComponent implements OnInit {
  public tableId: string;
  public seatId: string;
  public allTableOrders$: BehaviorSubject<IFloorMapTableOrderObjects>;
  public tableOrders: IFloorMapTableOrders;

  constructor(private _nbDialogRef: NbDialogRef<unknown>) {}

  ngOnInit(): void {
    this.allTableOrders$
      .pipe()
      .subscribe((tableOrders: IFloorMapTableOrderObjects): void => {
        this.tableOrders = tableOrders[`${this.tableId}.${this.seatId}`];
      });
  }

  public close(): void {
    this._nbDialogRef.close();
  }
}
