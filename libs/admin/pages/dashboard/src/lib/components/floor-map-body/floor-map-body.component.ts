import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild,
} from '@angular/core';
import * as fp from 'lodash/fp';
import {
  getOrdersByUser,
  getTableOrders,
  ordersSelectors,
} from '@bgap/admin/shared/data-access/orders';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import {
  fabricCanvas,
  floorMapActions,
  floorMapSelectors,
  getObjectById,
  getStatusBgColor,
  getTableSeatId,
  getTableSeatIds,
  registerCanvasEvent,
  setBgColor,
  setBorder,
} from '@bgap/admin/shared/floor-map';
import { objectToArray } from '@bgap/shared/utils';
import {
  IFloorMapTableOrderObjects,
  IFloorMapTableOrders,
  IFloorMapUserOrderObjects,
} from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';
import { FloorMapOrdersComponent } from '../floor-map-orders/floor-map-orders.component';
import { Group } from 'fabric/fabric-impl';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-floor-map-body',
  templateUrl: './floor-map-body.component.html',
})
export class FloorMapBodyComponent implements OnInit, OnDestroy {
  @ViewChild('floorMap') floorMapEl?: ElementRef;

  public unit?: CrudApi.Unit;

  private _allTableOrders: IFloorMapTableOrderObjects = {};
  private _allTableOrders$: BehaviorSubject<IFloorMapTableOrderObjects> =
    new BehaviorSubject({});

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store,
    private _nbDialogService: NbDialogService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this._store.dispatch(floorMapActions.resetFloorMap());
  }

  ngOnInit(): void {
    this._store
      .pipe(
        select(unitsSelectors.getSelectedUnit),
        tap((): void => {
          this.unit = undefined;
        }),
        filter((unit: CrudApi.Unit | undefined): boolean => !!unit),
        tap((unit: CrudApi.Unit | undefined): void => {
          this.unit = fp.cloneDeep(unit);

          // Update html - show floor-map component
          this._changeDetectorRef.detectChanges();
        }),
        switchMap(
          (): Observable<boolean> =>
            this._store.pipe(
              select(floorMapSelectors.getInitialized),
              filter((initialized): boolean => !!initialized),
              take(1),
            ),
        ),
        tap((): void => {
          if (this.unit?.floorMap?.objects) {
            registerCanvasEvent('mouse:up', this._onMouseUp);
          }

          const padding = 20;
          const clientHeight =
            (<HTMLElement>document.querySelector('#dashboardMainCardBody'))
              .clientHeight -
            2 * padding;
          const clientWidth =
            (<HTMLElement>document.querySelector('#dashboardMainCardBody'))
              .clientWidth -
            2 * padding;
          const scale =
            (this.unit?.floorMap?.w || 1) / (this.unit?.floorMap?.h || 1) >
            clientWidth / clientHeight
              ? clientWidth / (this.unit?.floorMap?.w || 1)
              : clientHeight / (this.unit?.floorMap?.h || 1);

          (<HTMLElement>(
            document.querySelector('#floorMap')
          )).style.transform = `scale(${scale.toFixed(2)})`;
          (<HTMLElement>(
            document.querySelector('#floorMap')
          )).style.transformOrigin = 'top left';
        }),
        switchMap(
          (): Observable<CrudApi.Order[]> =>
            this._store.pipe(select(ordersSelectors.getAllActiveOrders)),
        ),
        untilDestroyed(this),
      )
      .subscribe((orders: CrudApi.Order[]): void => {
        if (this.unit?.floorMap?.objects) {
          const floorMapRawObjects: CrudApi.FloorMapDataObject[] = <
            CrudApi.FloorMapDataObject[]
          >objectToArray(this.unit.floorMap.objects, 'id');
          const tableSeatIds: string[] = getTableSeatIds(this.unit.floorMap);
          const ordersByUser: IFloorMapUserOrderObjects =
            getOrdersByUser(orders);
          this._allTableOrders = getTableOrders(tableSeatIds, ordersByUser);

          // For the modal
          this._allTableOrders$.next(this._allTableOrders);

          // tableOrders contains ALL seats!
          Object.values(this._allTableOrders).forEach(
            (tableOrder: IFloorMapTableOrders): void => {
              const rawObj: CrudApi.FloorMapDataObject = <
                CrudApi.FloorMapDataObject
              >floorMapRawObjects.find(
                (o: CrudApi.FloorMapDataObject): boolean =>
                  getTableSeatId(o) === tableOrder.tsID,
              );

              const fabricObj: Group = <Group>getObjectById(rawObj?.id || '');

              if (fabricObj) {
                // Highlight or clear border
                setBorder(
                  fabricObj,
                  tableOrder.hasPaymentIntention ? '#ff0000' : undefined,
                  tableOrder.hasPaymentIntention ? 5 : undefined,
                );

                // Repaint or clear bg
                setBgColor(
                  fabricObj,
                  getStatusBgColor(tableOrder.lowestStatus),
                );
              }
            },
          );

          fabricCanvas.renderAll();
        }
      });
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _onMouseUp = (e: any): void => {
    if (e.target.type.indexOf('seat') === 0) {
      const rawObject: CrudApi.FloorMapDataObject = <
        CrudApi.FloorMapDataObject
      >this.unit?.floorMap?.objects?.[e.target?.id];

      if (rawObject) {
        const dialog = this._nbDialogService.open(FloorMapOrdersComponent, {
          dialogClass: 'floor-map-order-dialog',
        });

        dialog.componentRef.instance.tableId = rawObject.tID || '';
        dialog.componentRef.instance.seatId = rawObject.sID || '';
        dialog.componentRef.instance.allTableOrders$ = this._allTableOrders$;
      }

      this._changeDetectorRef.detectChanges();
    }
  };
}
