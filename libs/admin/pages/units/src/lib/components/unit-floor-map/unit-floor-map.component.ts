import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import * as floorMapLib from '@bgap/admin/shared/floor-map';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import * as CrudApi from '@bgap/crud-gql/api';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unit-floor-map',
  templateUrl: './unit-floor-map.component.html',
  styleUrls: ['./unit-floor-map.component.scss'],
})
export class UnitFloorMapComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public unit!: CrudApi.Unit;
  public rawForm!: FormGroup;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._store.dispatch(floorMapLib.floorMapActions.resetFloorMap());
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      floorMap: [this.unit.floorMap || ''],
    });

    /* JUST FOR MANUAL EDIT!!!
    this.rawForm = this._formBuilder.group({
      floorMap: [JSON.stringify(this.unit.floorMap) || {}],
    });
    */
  }

  public submit(): void {
    this._dataService
      .updateUnit$({ id: this.unit.id, floorMap: floorMapLib.mapRawData })
      .toPromise()
      .then(
        (): void => {
          this._toasterService.showSimpleSuccess('common.updateSuccessful');
          this.close();
        },
        err => {
          console.error('GROUP UPDATE ERROR', err);
        },
      );
  }

  /*
  public submitRaw(): void {
    this._dataService.updateUnit(this.unit.id, { floorMap: JSON.parse(this.rawForm.value.floorMap) }).then(
      (): void => {
        this._toasterService.showSimpleSuccess('common.updateSuccessful');
        this.close();
      },
      (err) => {
        console.error('GROUP UPDATE ERROR', err);
      }
    );
  }
  */
}
