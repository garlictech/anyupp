import { skipWhile, take } from 'rxjs/operators';
import { DEFAULT_LANE_COLOR } from 'src/app/shared/const';
import { IUnit } from 'src/app/shared/interfaces';
import { IState } from 'src/app/store';
import { unitListSelectors } from 'src/app/store/selectors';

import { Component, Input, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-colorized-lane-icon',
  templateUrl: './colorized-lane-icon.component.html',
  styleUrls: ['./colorized-lane-icon.component.scss'],
})
export class ColorizedLaneIconComponent implements OnInit {
  @Input() laneId: string;
  public laneColor: string;

  constructor(private _store: Store<IState>) {
    this.laneColor = DEFAULT_LANE_COLOR;
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(unitListSelectors.getSelectedUnit),
        skipWhile((unit: IUnit): boolean => !unit),
        take(1)
      )
      .subscribe((unit: IUnit): void => {
        this.laneColor = unit.lanes[this.laneId]?.color || DEFAULT_LANE_COLOR;
      });
  }
}
