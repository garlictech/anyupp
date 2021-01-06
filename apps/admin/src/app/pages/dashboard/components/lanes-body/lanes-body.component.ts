import { combineLatest } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { DEFAULT_LANE_COLOR } from 'src/app/shared/const';
import { EDashboardSize, ENebularButtonSize, EOrderStatus } from 'src/app/shared/enums';
import { IDetailedLane, ILaneOrderItem, IUnit } from 'src/app/shared/interfaces';
import { objectToArray } from 'src/app/shared/pure';
import { IState } from 'src/app/store';
import { dashboardActions } from 'src/app/store/actions';
import { dashboardSelectors, orderListSelectors, unitListSelectors } from 'src/app/store/selectors';

import { Component, OnDestroy } from '@angular/core';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

const laneFilter = (selectedLanes: string[]): any => (orderItem: ILaneOrderItem): boolean =>
  selectedLanes.includes(orderItem.laneId || 'default');

@UntilDestroy()
@Component({
  selector: 'app-lanes-body',
  templateUrl: './lanes-body.component.html',
  styleUrls: ['./lanes-body.component.scss'],
})
export class LanesBodyComponent implements OnDestroy {
  public placedItems: ILaneOrderItem[];
  public processingItems: ILaneOrderItem[];
  public readyItems: ILaneOrderItem[];
  public buttonSize: ENebularButtonSize;
  public selectedLanes: string[] = [];
  public unit: IUnit;
  public unitLanes: IDetailedLane[];
  public DEFAULT_LANE_COLOR = DEFAULT_LANE_COLOR;

  constructor(private _store: Store<IState>, private _translateService: TranslateService) {
    combineLatest([
      this._store.pipe(select(orderListSelectors.getLaneOrderItemsByStatus(EOrderStatus.PLACED))),
      this._store.pipe(select(orderListSelectors.getLaneOrderItemsByStatus(EOrderStatus.PROCESSING))),
      this._store.pipe(select(orderListSelectors.getLaneOrderItemsByStatus(EOrderStatus.READY))),
      this._store.pipe(
        select(dashboardSelectors.getSelectedLanes),
        filter((l): boolean => !!l)
      ),
      this._store.pipe(
        select(unitListSelectors.getSelectedUnit),
        filter((unit: IUnit): boolean => !!unit)
      ),
    ])
      .pipe(debounceTime(100), untilDestroyed(this))
      .subscribe(
        ([rawPlacedItems, rawProcessingItems, rawReadyItems, selectedLanes, unit]: [
          ILaneOrderItem[],
          ILaneOrderItem[],
          ILaneOrderItem[],
          string[],
          IUnit
        ]): void => {
          this.selectedLanes = selectedLanes;
          this.placedItems = rawPlacedItems.filter(laneFilter(selectedLanes));
          this.processingItems = rawProcessingItems.filter(laneFilter(selectedLanes));
          this.readyItems = rawReadyItems.filter(laneFilter(selectedLanes));
          this.unit = unit;
          this.unitLanes = objectToArray(unit.lanes);

          // Unit lanes
          this.unitLanes.forEach((lane: IDetailedLane): void => {
            lane.placedCount = rawPlacedItems.filter((i): boolean => i.laneId === lane._id).length;
            lane.processingCount = rawProcessingItems.filter((i): boolean => i.laneId === lane._id).length;
            lane.readyCount = rawReadyItems.filter((i): boolean => i.laneId === lane._id).length;
          });

          // Default lane first
          this.unitLanes.unshift({
            _id: 'default',
            name: this._translateService.instant('dashboard.defaultLane'),
            color: DEFAULT_LANE_COLOR,
            placedCount: rawPlacedItems.filter((i): boolean => typeof i.laneId === 'undefined').length,
            processingCount: rawProcessingItems.filter((i): boolean => typeof i.laneId === 'undefined').length,
            readyCount: rawReadyItems.filter((i): boolean => typeof i.laneId === 'undefined').length,
          });
        }
      );

    this._store
      .pipe(select(dashboardSelectors.getSize), untilDestroyed(this))
      .subscribe((size: EDashboardSize): void => {
        this.buttonSize = size === EDashboardSize.LARGER ? ENebularButtonSize.MEDIUM : ENebularButtonSize.SMALL;
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public toggleLane(laneId: string): void {
    if (this.selectedLanes.includes(laneId)) {
      this._store.dispatch(
        dashboardActions.setSelectedLanes({
          selectedLanes: this.selectedLanes.filter((id: string): boolean => id !== laneId),
        })
      );
    } else {
      this._store.dispatch(
        dashboardActions.setSelectedLanes({
          selectedLanes: this.selectedLanes.concat(laneId),
        })
      );
    }
  }
}
