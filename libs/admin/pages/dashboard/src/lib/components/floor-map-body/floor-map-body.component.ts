import { BehaviorSubject, Observable } from 'rxjs';
import { filter, switchMap, take, tap } from 'rxjs/operators';

import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import {
  fabricCanvas, floorMapActions, floorMapSelectors, getObjectById, getStatusBgColor, getTableSeatId, getTableSeatIds,
  registerCanvasEvent, setBgColor, setBorder
} from '@bgap/admin/shared/floor-map';
import { getOrdersByUser, getTableOrders, ordersSelectors } from '@bgap/admin/shared/data-access/orders';
import { objectToArray } from '@bgap/admin/shared/utils';
import {
  IFloorMapDataObject, IFloorMapTableOrderObjects, IFloorMapTableOrders, IFloorMapUserOrderObjects, IOrder, IUnit
} from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

import { FloorMapOrdersComponent } from '../floor-map-orders/floor-map-orders.component';

@UntilDestroy()
@Component({
  selector: 'bgap-floor-map-body',
  templateUrl: './floor-map-body.component.html'
})
export class FloorMapBodyComponent implements OnInit, OnDestroy {
  @ViewChild('floorMap') floorMapEl: ElementRef;

  public unit: IUnit;

  private _allTableOrders: IFloorMapTableOrderObjects = {};
  private _allTableOrders$: BehaviorSubject<
    IFloorMapTableOrderObjects
  > = new BehaviorSubject({});

  constructor(
    private _store: Store<any>,
    private _nbDialogService: NbDialogService
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
        filter((unit: IUnit): boolean => !!unit),
        tap((unit: IUnit): void => {
          this.unit = unit;
        }),
        switchMap(
          (): Observable<boolean> =>
            this._store.pipe(
              select(floorMapSelectors.getInitialized),
              filter((initialized): boolean => !!initialized),
              take(1)
            )
        ),
        tap((): void => {
          if (this.unit.floorMap?.objects) {
            registerCanvasEvent('mouse:up', this._onMouseUp);
          }

          const padding = 20;
          const clientHeight =
            document.querySelector('#dashboardMainCardBody').clientHeight -
            2 * padding;
          const clientWidth =
            document.querySelector('#dashboardMainCardBody').clientWidth -
            2 * padding;
          const scale =
            this.unit.floorMap.w / this.unit.floorMap.h >
            clientWidth / clientHeight
              ? clientWidth / this.unit.floorMap.w
              : clientHeight / this.unit.floorMap.h;

          (<HTMLElement>document.querySelector('#floorMap')).style.transform = `scale(${scale.toFixed(2)})`;
          (<HTMLElement>document.querySelector('#floorMap')).style.transformOrigin =
            'top left';
        }),
        switchMap(
          (): Observable<IOrder[]> =>
            this._store.pipe(select(ordersSelectors.getAllActiveOrders))
        ),
        untilDestroyed(this)
      )
      .subscribe((orders: IOrder[]): void => {
        if (this.unit.floorMap?.objects) {
          const floorMapRawObjects: IFloorMapDataObject[] = objectToArray(
            this.unit.floorMap?.objects,
            'id'
          );
          const tableSeatIds: string[] = getTableSeatIds(this.unit.floorMap);
          const ordersByUser: IFloorMapUserOrderObjects = getOrdersByUser(
            orders
          );
          this._allTableOrders = getTableOrders(tableSeatIds, ordersByUser);

          // For the modal
          this._allTableOrders$.next(this._allTableOrders);

          // tableOrders contains ALL seats!
          Object.values(this._allTableOrders).forEach(
            (tableOrder: IFloorMapTableOrders): void => {
              const rawObj: IFloorMapDataObject = floorMapRawObjects.find(
                (o: IFloorMapDataObject): boolean =>
                  getTableSeatId(o) === tableOrder.tsID
              );

              const fabricObj = getObjectById(rawObj?.id);

              if (fabricObj) {
                // Highlight or clear border
                setBorder(
                  fabricObj,
                  tableOrder.hasPaymentIntention ? '#ff0000' : undefined,
                  tableOrder.hasPaymentIntention ? 5 : undefined
                );

                // Repaint or clear bg
                setBgColor(
                  fabricObj,
                  getStatusBgColor(tableOrder.lowestStatus)
                );
              }
            }
          );

          fabricCanvas.renderAll();
        }
      });
  }

  // eslint-disable-next-line @angular-eslint/no-empty-lifecycle-method
  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _onMouseUp = (e): void => {
    if (e.target.type?.indexOf('seat') === 0) {
      const rawObject: IFloorMapDataObject = this.unit.floorMap.objects[
        e.target.id
      ];

      if (rawObject) {
        const dialog = this._nbDialogService.open(FloorMapOrdersComponent, {
          hasBackdrop: true,
          closeOnBackdropClick: false,
          hasScroll: true,
          dialogClass: 'floor-map-order-dialog'
        });

        dialog.componentRef.instance.tableId = rawObject.tID;
        dialog.componentRef.instance.seatId = rawObject.sID;
        dialog.componentRef.instance.allTableOrders$ = this._allTableOrders$;
      }
    }
  };
}
