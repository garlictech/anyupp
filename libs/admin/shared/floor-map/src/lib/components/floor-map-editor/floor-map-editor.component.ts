import { debounceTime } from 'rxjs/operators';

import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { CrudApi } from '@bgap/crud-gql/api';
import { IFloorMapData, IFloorMapDataObject } from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import * as floorMapActions from '../../+state/floor-map.actions';
import { FLOOR_MAP_OBJECT_COMMON_DEFAULTS, FLOOR_MAP_OBJECT_DEFAULTS } from '../../const';
import * as floorMapFuncs from '../../fn';

@UntilDestroy()
@Component({
  selector: 'bgap-floor-map-editor',
  templateUrl: './floor-map-editor.component.html',
  styleUrls: ['./floor-map-editor.component.scss'],
})
export class FloorMapEditorComponent
  implements OnInit, OnDestroy, AfterViewInit {
  @Input() editMode?: boolean;
  @Input() floorMap?: IFloorMapData;
  public dimensionForm!: FormGroup;
  public objectForm!: FormGroup;
  public EUnitMapObjectType = CrudApi.UnitMapObjectType;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>, private _formBuilder: FormBuilder) {}

  ngOnInit(): void {
    const w = this.floorMap?.w || 800;
    const h = this.floorMap?.h || 300;

    floorMapFuncs.initRawData(w, h);

    this.dimensionForm = this._formBuilder.group({
      width: [w],
      height: [h],
    });
    this.objectForm = this._formBuilder.group({
      text: [''],
      tableId: [''],
      seatId: [''],
    });

    this.dimensionForm.valueChanges
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe((value): void => {
        floorMapFuncs.resizeCanvas(value.width, value.height);
        floorMapFuncs.mapRawData.w = +value.width;
        floorMapFuncs.mapRawData.h = +value.height;
      });
    this.objectForm.valueChanges
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe((value): void => {
        floorMapFuncs.setTextToActiveObject(value.text);

        floorMapFuncs.setRawDataField('c', value.text);
        floorMapFuncs.setRawDataField('tID', value.tableId || null);
        floorMapFuncs.setRawDataField('sID', value.seatId || null);
      });
  }

  ngAfterViewInit(): void {
    floorMapFuncs.initCanvas(this.editMode || false);
    floorMapFuncs.resizeCanvas(
      this.dimensionForm?.value.width,
      this.dimensionForm?.value.height,
    );

    if (this.editMode) {
      floorMapFuncs.registerCanvasEvent(
        'object:modified',
        floorMapFuncs.updateObjectMapRawData,
      );
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      floorMapFuncs.registerCanvasEvent('mouse:up', (e: any): void => {
        if (e.target?.id) {
          this.objectForm?.setValue({
            text: floorMapFuncs.getObjectText(e.target),
            tableId: floorMapFuncs.getRawDataField(e.target, 'tID') || '',
            seatId: floorMapFuncs.getRawDataField(e.target, 'sID') || '',
          });

          this.objectForm?.controls['tableId'][
            floorMapFuncs.isTableOrSeat(e.target) ? 'enable' : 'disable'
          ]();
          this.objectForm?.controls['seatId'][
            floorMapFuncs.isSeat(e.target) ? 'enable' : 'disable'
          ]();
        } else {
          this.objectForm?.setValue({
            text: '',
            tableId: '',
            seatId: '',
          });
        }
      });
    }

    // Load existing data
    if (this.floorMap) {
      floorMapFuncs.loadRawData(this.floorMap);

      this.dimensionForm?.patchValue({
        width: floorMapFuncs.mapRawData.w,
        height: floorMapFuncs.mapRawData.h,
      });
    }

    this._store.dispatch(
      floorMapActions.floorMapInitialized({ initialized: true }),
    );
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addObject(objectType: CrudApi.UnitMapObjectType): void {
    const id = floorMapFuncs.generateId();
    const rawDataObject: IFloorMapDataObject = {
      id,
      t: objectType,
      ...FLOOR_MAP_OBJECT_COMMON_DEFAULTS,
      ...FLOOR_MAP_OBJECT_DEFAULTS[objectType],
    };

    floorMapFuncs.loadRawDataObject(rawDataObject, true);
  }

  public removeObject(): void {
    floorMapFuncs.removeActiveObject();
  }

  public copyObject(): void {
    floorMapFuncs.copyActiveObject();
  }
}
