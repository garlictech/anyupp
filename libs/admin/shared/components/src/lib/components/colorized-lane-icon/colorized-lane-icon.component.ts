import { skipWhile, take } from 'rxjs/operators';

import { Component, Input, OnInit } from '@angular/core';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { DEFAULT_LANE_COLOR } from '@bgap/admin/shared/utils';
import { IUnit } from '@bgap/shared/types';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'bgap-colorized-lane-icon',
  templateUrl: './colorized-lane-icon.component.html',
  styleUrls: ['./colorized-lane-icon.component.scss']
})
export class ColorizedLaneIconComponent implements OnInit {
  @Input() laneId: string;
  public laneColor: string;

  constructor(private _store: Store<any>) {
    this.laneColor = DEFAULT_LANE_COLOR;
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(unitsSelectors.getSelectedUnit),
        skipWhile((unit: IUnit): boolean => !unit),
        take(1)
      )
      .subscribe((unit: IUnit): void => {
        this.laneColor = unit.lanes[this.laneId]?.color || DEFAULT_LANE_COLOR;
      });
  }
}
