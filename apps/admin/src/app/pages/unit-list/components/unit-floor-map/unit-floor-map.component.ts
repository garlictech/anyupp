import { IUnit } from 'src/app/shared/interfaces';
import { AbstractFormDialogComponent } from 'src/app/shared/modules/shared-forms/components/abstract-form-dialog/abstract-form-dialog.component';
import * as floorMapFuncs from 'src/app/shared/pure';
import { EToasterType } from 'src/app/shared/services/toaster';

import { Component, Injector, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { IState } from 'src/app/store';
import { floorMapActions } from 'src/app/store/actions';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-unit-floor-map',
  templateUrl: './unit-floor-map.component.html',
  styleUrls: ['./unit-floor-map.component.scss'],
})
export class UnitFloorMapComponent extends AbstractFormDialogComponent implements OnInit {
  public unit: IUnit;
  public rawForm: FormGroup;

  private _store: Store<IState>;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._store = this._injector.get(Store);
    this._store.dispatch(floorMapActions.resetFloorMap());
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      floorMap: [this.unit.floorMap || ''],
    });

    /*
    this.rawForm = this._formBuilder.group({
      floorMap: [JSON.stringify(this.unit.floorMap) || {}],
    });
    */
  }

  public submit(): void {
    this._dataService.updateUnit(this.unit._id, { floorMap: floorMapFuncs.mapRawData }).then(
      (): void => {
        this._toasterService.show(EToasterType.SUCCESS, '', 'common.updateSuccessful');
        this.close();
      },
      (err): any => {
        console.error('GROUP UPDATE ERROR', err);
      }
    );
  }

  /*
  public submitRaw(): void {
    this._dataService.updateUnit(this.unit._id, { floorMap: JSON.parse(this.rawForm.value.floorMap) }).then(
      (): void => {
        this._toasterService.show(EToasterType.SUCCESS, '', 'common.updateSuccessful');
        this.close();
      },
      (err): any => {
        console.error('GROUP UPDATE ERROR', err);
      }
    );
  }
  */
}
