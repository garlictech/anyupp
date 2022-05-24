import { cloneDeep } from 'lodash/fp';
import { combineLatest } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
} from '@angular/core';
import {
  dashboardActions,
  dashboardSelectors,
} from '../../../../store/dashboard';
import { ordersSelectors } from '../../../../store/orders';
import { unitsSelectors } from '../../../../store/units';
import { DEFAULT_LANE_COLOR } from '../../../../shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  EDashboardSize,
  ENebularButtonSize,
  DetailedLane,
  LaneOrderItem,
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

const laneFilter =
  (selectedLanes: string[]) =>
  (orderItem: LaneOrderItem): boolean =>
    selectedLanes.includes(orderItem.laneId || 'default');

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-lanes-body',
  templateUrl: './lanes-body.component.html',
  styleUrls: ['./lanes-body.component.scss'],
})
export class LanesBodyComponent implements OnInit {
  public placedItems: LaneOrderItem[] = [];
  public processingItems: LaneOrderItem[] = [];
  public readyItems: LaneOrderItem[] = [];
  public buttonSize: ENebularButtonSize = ENebularButtonSize.SMALL;
  public selectedLanes: string[] = [];
  public unit?: CrudApi.Unit;
  public unitLanes: CrudApi.Maybe<DetailedLane>[] = [];
  public DEFAULT_LANE_COLOR = DEFAULT_LANE_COLOR;

  constructor(
    private _store: Store,
    private _translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  ngOnInit() {
    combineLatest([
      this._store.pipe(
        select(
          ordersSelectors.getLaneOrderItemsByStatus(CrudApi.OrderStatus.placed),
        ),
      ),
      this._store.pipe(
        select(
          ordersSelectors.getLaneOrderItemsByStatus(
            CrudApi.OrderStatus.processing,
          ),
        ),
      ),
      this._store.pipe(
        select(
          ordersSelectors.getLaneOrderItemsByStatus(CrudApi.OrderStatus.ready),
        ),
      ),
      this._store.pipe(
        select(dashboardSelectors.getSelectedLanes),
        filter((l): boolean => !!l),
      ),
      this._store.pipe(
        select(unitsSelectors.getSelectedUnit),
        filter((unit: CrudApi.Unit | undefined): boolean => !!unit),
      ),
    ])
      .pipe(debounceTime(100), untilDestroyed(this))
      .subscribe(
        ([
          rawPlacedItems,
          rawProcessingItems,
          rawReadyItems,
          selectedLanes,
          unit,
        ]: [
          LaneOrderItem[],
          LaneOrderItem[],
          LaneOrderItem[],
          string[],
          CrudApi.Unit | undefined,
        ]) => {
          this.selectedLanes = selectedLanes;
          this.placedItems = rawPlacedItems.filter(laneFilter(selectedLanes));
          this.processingItems = rawProcessingItems.filter(
            laneFilter(selectedLanes),
          );
          this.readyItems = rawReadyItems.filter(laneFilter(selectedLanes));
          this.unit = unit;
          this.unitLanes = unit?.lanes ? cloneDeep(unit.lanes) : [];

          // Unit lanes
          this.unitLanes.forEach((lane: CrudApi.Maybe<DetailedLane>) => {
            if (lane) {
              lane.placedCount = rawPlacedItems.filter(
                (i): boolean => i.laneId === lane.id,
              ).length;
              lane.processingCount = rawProcessingItems.filter(
                (i): boolean => i.laneId === lane.id,
              ).length;
              lane.readyCount = rawReadyItems.filter(
                (i): boolean => i.laneId === lane.id,
              ).length;
            }
          });

          // Default lane first
          this.unitLanes.unshift({
            id: 'default',
            name: this._translateService.instant('dashboard.defaultLane'),
            color: DEFAULT_LANE_COLOR,
            placedCount: rawPlacedItems.filter(
              (i): boolean => typeof i.laneId === 'undefined',
            ).length,
            processingCount: rawProcessingItems.filter(
              (i): boolean => typeof i.laneId === 'undefined',
            ).length,
            readyCount: rawReadyItems.filter(
              (i): boolean => typeof i.laneId === 'undefined',
            ).length,
          });

          this._changeDetectorRef.detectChanges();
        },
      );

    this._store
      .pipe(select(dashboardSelectors.getSize), untilDestroyed(this))
      .subscribe((size: EDashboardSize) => {
        this.buttonSize =
          size === EDashboardSize.LARGER
            ? ENebularButtonSize.MEDIUM
            : ENebularButtonSize.SMALL;

        this._changeDetectorRef.detectChanges();
      });

    this._changeDetectorRef.detectChanges();
  }

  public toggleLane(laneId: string) {
    if (this.selectedLanes.includes(laneId)) {
      this._store.dispatch(
        dashboardActions.setSelectedLanes({
          selectedLanes: this.selectedLanes.filter(
            (id: string): boolean => id !== laneId,
          ),
        }),
      );
    } else {
      this._store.dispatch(
        dashboardActions.setSelectedLanes({
          selectedLanes: this.selectedLanes.concat(laneId),
        }),
      );
    }

    this._changeDetectorRef.detectChanges();
  }
}
