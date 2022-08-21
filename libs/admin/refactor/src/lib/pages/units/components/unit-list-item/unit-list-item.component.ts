import { cloneDeep } from 'lodash/fp';

import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { PosType, Unit } from '@bgap/domain';
import { NbDialogService } from '@nebular/theme';
import { UnitBannersComponent } from '../unit-banners/unit-banners.component';
import { UnitFloorMapComponent } from '../unit-floor-map/unit-floor-map.component';
import { UnitFormComponent } from '../unit-form/unit-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unit-list-item',
  templateUrl: './unit-list-item.component.html',
  styleUrls: ['./unit-list-item.component.scss'],
})
export class UnitListItemComponent {
  @Input() unit?: Unit;
  public workingGenerateStatus = false;
  public ePosType = PosType;

  constructor(private _nbDialogService: NbDialogService) {}

  public editUnit() {
    const dialog = this._nbDialogService.open(UnitFormComponent);

    if (this.unit) {
      dialog.componentRef.instance.unit = cloneDeep(this.unit);
    }
  }

  public editUnitFloorMap() {
    const dialog = this._nbDialogService.open(UnitFloorMapComponent);

    if (this.unit) {
      dialog.componentRef.instance.unit = cloneDeep(this.unit);
    }
  }

  public editUnitBanners() {
    const dialog = this._nbDialogService.open(UnitBannersComponent);

    if (this.unit) {
      dialog.componentRef.instance.unit = cloneDeep(this.unit);
    }
  }
}
