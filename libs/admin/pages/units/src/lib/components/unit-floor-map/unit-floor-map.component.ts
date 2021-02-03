import { Component, Injector, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import * as floorMapLib from '@bgap/admin/shared/floor-map';
import { EToasterType } from '@bgap/admin/shared/utils';
import { IUnit } from '@bgap/shared/types';
import { Store } from '@ngrx/store';

@Component({
  selector: 'bgap-unit-floor-map',
  templateUrl: './unit-floor-map.component.html',
  styleUrls: ['./unit-floor-map.component.scss'],
})
export class UnitFloorMapComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public unit!: IUnit;
  public rawForm!: FormGroup;

  private _store: Store<any>;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._store = this._injector.get(Store);
    this._store.dispatch(floorMapLib.floorMapActions.resetFloorMap());
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
    this._dataService
      .updateUnit(this.unit._id, { floorMap: floorMapLib.mapRawData })
      .then(
        (): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.updateSuccessful'
          );
          this.close();
        },
        err => {
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
      (err) => {
        console.error('GROUP UPDATE ERROR', err);
      }
    );
  }
  */
}
