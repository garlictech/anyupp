import { debounceTime } from 'rxjs/operators';

import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  FloorMapData,
  FloorMapDataObject,
  Maybe,
  UnitMapObjectType,
} from '@bgap/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import * as floorMapActions from '../../+state/floor-map.actions';
import {
  FLOOR_MAP_OBJECT_COMMON_DEFAULTS,
  FLOOR_MAP_OBJECT_DEFAULTS,
} from '../../const';
import * as floorMapFuncs from '../../fn';

@UntilDestroy()
@Component({
  selector: 'bgap-floor-map-editor',
  templateUrl: './floor-map-editor.component.html',
  styleUrls: ['./floor-map-editor.component.scss'],
})
export class FloorMapEditorComponent implements OnInit, AfterViewInit {
  @Input() editMode?: boolean;
  @Input() floorMap?: Maybe<FloorMapData>;
  public dimensionForm?: FormGroup;
  public objectForm?: FormGroup;
  public EUnitMapObjectType = UnitMapObjectType;

  constructor(private _store: Store, private _formBuilder: FormBuilder) {}

  ngOnInit() {
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
      .subscribe(value => {
        floorMapFuncs.resizeCanvas(value.width, value.height);
        floorMapFuncs.mapRawData.w = +value.width;
        floorMapFuncs.mapRawData.h = +value.height;
      });
    this.objectForm.valueChanges
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe(value => {
        floorMapFuncs.setTextToActiveObject(value.text);

        floorMapFuncs.setRawDataField('c', value.text);
        floorMapFuncs.setRawDataField('tID', value.tableId || null);
        floorMapFuncs.setRawDataField('sID', value.seatId || null);
      });
  }

  ngAfterViewInit() {
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
      floorMapFuncs.registerCanvasEvent('mouse:up', (e: any) => {
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

  public addObject(objectType: keyof typeof UnitMapObjectType) {
    const id = floorMapFuncs.generateId();
    const rawDataObject: FloorMapDataObject = {
      id,
      t: UnitMapObjectType[objectType],
      ...FLOOR_MAP_OBJECT_COMMON_DEFAULTS,
      ...FLOOR_MAP_OBJECT_DEFAULTS[objectType],
    };

    floorMapFuncs.loadRawDataObject(rawDataObject, true);
  }

  public removeObject() {
    floorMapFuncs.removeActiveObject();
  }

  public copyObject() {
    floorMapFuncs.copyActiveObject();
  }
}
