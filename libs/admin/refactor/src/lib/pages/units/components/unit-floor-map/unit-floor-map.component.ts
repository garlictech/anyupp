import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  Injector,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Unit } from '@bgap/domain';

import { floorMapActions, mapRawData } from '../../../../shared/floor-map';
import { AbstractFormDialogComponent } from '../../../../shared/forms';
import { QrGeneratorService } from '../../../../shared/utils';

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
  @ViewChild('container') container!: ElementRef;
  public unit!: Unit;
  public rawForm?: FormGroup;

  constructor(
    protected override _injector: Injector,
    private _qrGeneratorService: QrGeneratorService,
  ) {
    super(_injector);

    this._store.dispatch(floorMapActions.resetFloorMap());
  }

  async ngOnInit() {
    this.dialogForm = this._formBuilder.group({
      floorMap: [this.unit.floorMap || ''],
    });

    /* JUST FOR MANUAL EDIT!!!
    this.rawForm = this._formBuilder.group({
      floorMap: [JSON.stringify(this.unit.floorMap) || {}],
    });
    */
  }

  public submit() {
    this._dataService
      .updateUnit$({ id: this.unit.id, floorMap: mapRawData })
      .toPromise()
      .then(
        () => {
          this._toasterService.showSimpleSuccess('update');
          this.close();
        },
        err => {
          console.error('GROUP UPDATE ERROR', err);
        },
      );
  }

  public printQR() {
    if (this.unit.floorMap) {
      this._qrGeneratorService.printCodes(this.unit);
    }
  }

  /*
  public submitRaw() {
    this._dataService.updateUnit(this.unit.id, { floorMap: JSON.parse(this.rawForm.value.floorMap) }).then(
      () => {
        this._toasterService.showSimpleSuccess('update');
        this.close();
      },
      (err) => {
        console.error('GROUP UPDATE ERROR', err);
      }
    );
  }
  */
}
