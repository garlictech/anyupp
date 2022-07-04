import { debounceTime } from 'rxjs/operators';

import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import {
  FloorMapData,
  FloorMapDataObject,
  Maybe,
  UnitMapObjectType,
} from '@bgap/domain';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { Store } from '@ngrx/store';

import { floorMapInitialized } from '../../+state/floor-map.actions';
import {
  FLOOR_MAP_OBJECT_COMMON_DEFAULTS,
  FLOOR_MAP_OBJECT_DEFAULTS,
} from '../../const';
import {
  copyActiveObject,
  generateId,
  getObjectText,
  getRawDataField,
  initCanvas,
  initRawData,
  isSeat,
  isTableOrSeat,
  loadRawData,
  loadRawDataObject,
  mapRawData,
  registerCanvasEvent,
  removeActiveObject,
  resizeCanvas,
  setRawDataField,
  setTextToActiveObject,
  updateObjectMapRawData,
} from '../../fn';

@UntilDestroy()
@Component({
  selector: 'bgap-floor-map-editor',
  templateUrl: './floor-map-editor.component.html',
  styleUrls: ['./floor-map-editor.component.scss'],
})
export class FloorMapEditorComponent implements OnInit, AfterViewInit {
  @Input() editMode?: boolean;
  @Input() floorMap?: Maybe<FloorMapData>;
  public dimensionForm?: UntypedFormGroup;
  public objectForm?: UntypedFormGroup;
  public EUnitMapObjectType = UnitMapObjectType;

  constructor(
    private _store: Store,
    private _formBuilder: UntypedFormBuilder,
  ) {}

  ngOnInit() {
    const w = this.floorMap?.w || 800;
    const h = this.floorMap?.h || 300;

    initRawData(w, h);

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
        resizeCanvas(value.width, value.height);
        mapRawData.w = +value.width;
        mapRawData.h = +value.height;
      });
    this.objectForm.valueChanges
      .pipe(debounceTime(500), untilDestroyed(this))
      .subscribe(value => {
        setTextToActiveObject(value.text);

        setRawDataField('c', value.text);
        setRawDataField('tID', value.tableId || null);
        setRawDataField('sID', value.seatId || null);
      });
  }

  ngAfterViewInit() {
    initCanvas(this.editMode || false);
    resizeCanvas(
      this.dimensionForm?.value.width,
      this.dimensionForm?.value.height,
    );

    if (this.editMode) {
      registerCanvasEvent('object:modified', updateObjectMapRawData);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      registerCanvasEvent('mouse:up', (e: any) => {
        if (e.target?.id) {
          this.objectForm?.setValue({
            text: getObjectText(e.target),
            tableId: getRawDataField(e.target, 'tID') || '',
            seatId: getRawDataField(e.target, 'sID') || '',
          });

          this.objectForm?.controls['tableId'][
            isTableOrSeat(e.target) ? 'enable' : 'disable'
          ]();
          this.objectForm?.controls['seatId'][
            isSeat(e.target) ? 'enable' : 'disable'
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
      loadRawData(this.floorMap);

      this.dimensionForm?.patchValue({
        width: mapRawData.w,
        height: mapRawData.h,
      });
    }

    this._store.dispatch(floorMapInitialized({ initialized: true }));
  }

  public addObject(objectType: keyof typeof UnitMapObjectType) {
    const id = generateId();
    const rawDataObject: FloorMapDataObject = {
      id,
      t: UnitMapObjectType[objectType],
      ...FLOOR_MAP_OBJECT_COMMON_DEFAULTS,
      ...FLOOR_MAP_OBJECT_DEFAULTS[objectType],
    };

    loadRawDataObject(rawDataObject, true);
  }

  public removeObject() {
    removeActiveObject();
  }

  public copyObject() {
    copyActiveObject();
  }
}
