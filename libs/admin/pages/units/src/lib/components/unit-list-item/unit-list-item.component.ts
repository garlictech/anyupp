import * as fp from 'lodash/fp';

import { Component, Input } from '@angular/core';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { IUnit } from '@bgap/shared/types';
import { NbDialogService } from '@nebular/theme';

import { UnitFloorMapComponent } from '../unit-floor-map/unit-floor-map.component';
import { UnitFormComponent } from '../unit-form/unit-form.component';

@Component({
  selector: 'bgap-unit-list-item',
  templateUrl: './unit-list-item.component.html',
  styleUrls: ['./unit-list-item.component.scss'],
})
export class UnitListItemComponent {
  @Input() unit!: IUnit;
  public workingGenerateStatus = false;

  constructor(
    private _nbDialogService: NbDialogService,
    private _dataService: DataService,
  ) {}

  public editUnit(): void {
    const dialog = this._nbDialogService.open(UnitFormComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.unit = fp.cloneDeep(this.unit);
  }

  public editUnitFloorMap(): void {
    const dialog = this._nbDialogService.open(UnitFloorMapComponent, {
      dialogClass: 'form-dialog',
    });

    dialog.componentRef.instance.unit = fp.cloneDeep(this.unit);
  }

  public regenerateData(): void {
    this.workingGenerateStatus = true;
    this._dataService.regenerateUnitData(this.unit.id).then((): void => {
      this.workingGenerateStatus = false;
    });
  }
}
