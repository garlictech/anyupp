import { skipWhile, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { DEFAULT_LANE_COLOR } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { select, Store } from '@ngrx/store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-colorized-lane-icon',
  templateUrl: './colorized-lane-icon.component.html',
  styleUrls: ['./colorized-lane-icon.component.scss'],
})
export class ColorizedLaneIconComponent implements OnInit {
  @Input() laneId!: string;
  public laneColor: string;

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.laneColor = DEFAULT_LANE_COLOR;
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(unitsSelectors.getSelectedUnit),
        skipWhile((unit: CrudApi.Unit | undefined): boolean => !unit),
        take(1),
      )
      .subscribe((unit: CrudApi.Unit | undefined): void => {
        this.laneColor =
          unit?.lanes?.find(l => l.id === this.laneId)?.color ||
          DEFAULT_LANE_COLOR;

        this._changeDetectorRef.detectChanges();
      });
  }
}
