import { cloneDeep as _cloneDeep } from 'lodash-es';
import { IUnit } from '../../shared/interfaces';
import { DataService } from 'src/app/shared/services/data';

import { Component, Input } from '@angular/core';
import { NbDialogService } from '@nebular/theme';

import { UnitFloorMapComponent } from '../unit-floor-map/unit-floor-map.component';
import { UnitFormComponent } from '../unit-form/unit-form.component';

@Component({
  selector: 'app-unit-list-item',
  templateUrl: './unit-list-item.component.html',
  styleUrls: ['./unit-list-item.component.scss'],
})
export class UnitListItemComponent {
  @Input() unit: IUnit;
  public workingGenerateStatus: boolean;

  constructor(
    private _nbDialogService: NbDialogService,
    private _dataService: DataService
  ) {}

  public editUnit(): void {
    const dialog = this._nbDialogService.open(UnitFormComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.unit = _cloneDeep(this.unit);
  }

  public editUnitFloorMap(): void {
    const dialog = this._nbDialogService.open(UnitFloorMapComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.unit = _cloneDeep(this.unit);
  }

  public regenerateData(): void {
    this.workingGenerateStatus = true;
    this._dataService.regenerateUnitData(this.unit._id).then((): void => {
      this.workingGenerateStatus = false;
    });
  }
}
