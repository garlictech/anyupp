import * as fp from 'lodash/fp';
import { NGXLogger } from 'ngx-logger';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { EToasterType, ToasterService } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';

import { UnitFloorMapComponent } from '../unit-floor-map/unit-floor-map.component';
import { UnitFormComponent } from '../unit-form/unit-form.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unit-list-item',
  templateUrl: './unit-list-item.component.html',
  styleUrls: ['./unit-list-item.component.scss'],
})
export class UnitListItemComponent {
  @Input() unit!: CrudApi.Unit;
  public workingGenerateStatus = false;

  constructor(
    private _nbDialogService: NbDialogService,
    private _dataService: DataService,
    private _toasterService: ToasterService,
    private _logger: NGXLogger,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

  public editUnit(): void {
    const dialog = this._nbDialogService.open(UnitFormComponent);

    dialog.componentRef.instance.unit = fp.cloneDeep(this.unit);
  }

  public editUnitFloorMap(): void {
    const dialog = this._nbDialogService.open(UnitFloorMapComponent);

    dialog.componentRef.instance.unit = fp.cloneDeep(this.unit);
  }

  public async regenerateData(): Promise<void> {
    this.workingGenerateStatus = true;

    try {
      await this._dataService.regenerateUnitData(this.unit.id);

      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.updateSuccessful',
      );
    } catch (err) {
      this._toasterService.show(EToasterType.DANGER, '', 'common.updateError');

      this._logger.error(`REGENERATE UNIT DATA ERROR: ${JSON.stringify(err)}`);
    }

    this.workingGenerateStatus = false;
    this._changeDetectorRef.detectChanges();
  }
}
