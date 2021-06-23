import { Group } from 'fabric/fabric-impl';
import * as fp from 'lodash/fp';
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
import {
  getOrdersByUser,
  getTableOrders,
  getTableSeatOrders,
  ordersSelectors,
} from '@bgap/admin/shared/data-access/orders';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import {
  fabricCanvas,
  floorMapActions,
  floorMapSelectors,
  getObjectById,
  getStatusBgColor,
  getTableIds,
  getTableSeatId,
  getTableSeatIds,
  registerCanvasEvent,
  setBgColor,
  setBorder,
} from '@bgap/admin/shared/floor-map';
import * as CrudApi from '@bgap/crud-gql/api';
import { IFloorMapOrderObjects, IFloorMapOrders } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { FloorMapOrdersComponent } from '../floor-map-orders/floor-map-orders.component';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-floor-map-body',
  templateUrl: './floor-map-body.component.html',
})
export class FloorMapBodyComponent implements OnInit, OnDestroy {
  @ViewChild('floorMap') floorMapEl?: ElementRef;

  public unit?: CrudApi.Unit;

  private _allTableSeatOrders$: BehaviorSubject<
    IFloorMapOrderObjects
  > = new BehaviorSubject({});
  private _allTableOrders$: BehaviorSubject<
    IFloorMapOrderObjects
  > = new BehaviorSubject({});

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

          const floorMapElement = <HTMLElement>(
            document.querySelector('#floorMap')
          );
          if (floorMapElement) {
            floorMapElement.style.transform = `scale(${scale.toFixed(2)})`;
            floorMapElement.style.transformOrigin = 'top left';
          }
        }),
        switchMap(
          (): Observable<CrudApi.Order[]> =>
            this._store.pipe(select(ordersSelectors.getAllActiveOrders)),
        ),
        untilDestroyed(this),
      )
      .subscribe((orders: CrudApi.Order[]): void => {
        if (this.unit?.floorMap?.objects) {
          const tableIds = getTableIds(this.unit.floorMap);
          const tableSeatIds = getTableSeatIds(this.unit.floorMap);
          const ordersByUser = getOrdersByUser(orders);

          const _allTableSeatOrders = getTableSeatOrders(
            tableSeatIds,
            ordersByUser,
          );
          const _allTableOrders = getTableOrders(tableIds, ordersByUser);

          // For the modal window
          this._allTableSeatOrders$.next(_allTableSeatOrders);
          this._allTableOrders$.next(_allTableOrders);

          // Refresh seat color and border
          // tableOrders contains ALL seats!
          Object.values(_allTableSeatOrders).forEach(
            (tableSeatOrder: IFloorMapOrders): void => {
              const rawObj: CrudApi.FloorMapDataObject | undefined = (
                <CrudApi.FloorMapDataObject[]>this.unit?.floorMap?.objects || []
              ).find(
                (o: CrudApi.FloorMapDataObject): boolean =>
                  getTableSeatId(o) === tableSeatOrder.tsID,
              );

              const fabricObj: Group = <Group>getObjectById(rawObj?.id || '');

              if (fabricObj) {
                // Highlight or clear border
                setBorder(
                  fabricObj,
                  tableSeatOrder.hasPaymentIntention ? '#a9ff29' : undefined,
                  tableSeatOrder.hasPaymentIntention ? 5 : undefined,
                );

                // Repaint or clear bg
                setBgColor(
                  fabricObj,
                  tableSeatOrder.lowestStatus
                    ? getStatusBgColor(tableSeatOrder.lowestStatus)
                    : undefined,
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
    const rawObject: CrudApi.FloorMapDataObject = <CrudApi.FloorMapDataObject>(
      (this.unit?.floorMap?.objects || []).find(o => o.id === e.target?.id)
    );

    if (rawObject) {
      const dialog = this._nbDialogService.open(FloorMapOrdersComponent, {
        dialogClass: 'floor-map-order-dialog',
      });

      dialog.componentRef.instance.tableId = rawObject.tID || '';
      dialog.componentRef.instance.seatId = rawObject.sID || '';

      if (e.target.type.indexOf('seat') === 0) {
        dialog.componentRef.instance.mode = 'seat';
        dialog.componentRef.instance.allOrders$ = this._allTableSeatOrders$;
      } else {
        dialog.componentRef.instance.mode = 'table';
        dialog.componentRef.instance.allOrders$ = this._allTableOrders$;
      }
    }

    this._changeDetectorRef.detectChanges();
  };
}
