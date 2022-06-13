import { skipWhile, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { Unit } from '@bgap/domain';
import { select, Store } from '@ngrx/store';

import { DEFAULT_LANE_COLOR } from '../../../../shared/utils';
import { unitsSelectors } from '../../../../store/units';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-colorized-lane-icon',
  templateUrl: './colorized-lane-icon.component.html',
  styleUrls: ['./colorized-lane-icon.component.scss'],
})
export class ColorizedLaneIconComponent implements OnInit {
  @Input() laneId?: string | null;
  public laneColor: string;

  constructor(
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.laneColor = DEFAULT_LANE_COLOR;
  }

  ngOnInit() {
    this._store
      .pipe(
        select(unitsSelectors.getSelectedUnit),
        skipWhile((unit: Unit | undefined): boolean => !unit),
        take(1),
      )
      .subscribe((unit: Unit | undefined) => {
        this.laneColor =
          unit?.lanes?.find(l => l?.id === this.laneId)?.color ||
          DEFAULT_LANE_COLOR;

        this._changeDetectorRef.detectChanges();
      });
  }
}
