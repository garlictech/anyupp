import { cloneDeep } from 'lodash/fp';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { appCoreActions } from '../../../../store/app-core';
import { DataService } from '../../../../shared/data-access/data';
import { ToasterService } from '../../../../shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { jsonParsedOrNull } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';

import { UnitFloorMapComponent } from '../unit-floor-map/unit-floor-map.component';
import { UnitFormComponent } from '../unit-form/unit-form.component';
import { UnitBannersComponent } from '../unit-banners/unit-banners.component';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unit-list-item',
  templateUrl: './unit-list-item.component.html',
  styleUrls: ['./unit-list-item.component.scss'],
})
export class UnitListItemComponent {
  @Input() unit?: CrudApi.Unit;
  public workingGenerateStatus = false;
  public ePosType = CrudApi.PosType;

  constructor(
    private _store: Store,
    private _nbDialogService: NbDialogService,
    private _dataService: DataService,
    private _toasterService: ToasterService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {}

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

  public async regenerateData(): Promise<void> {
    this.workingGenerateStatus = true;

    if (this.unit) {
      this._dataService
        .regenerateUnitData$(this.unit?.id)
        .pipe(
          catchError(err => {
            const _err = jsonParsedOrNull(err.graphQLErrors?.[0]?.message);

            if (_err?.code === 'ERROR_NO_PRODUCT_IN_UNIT') {
              this._toasterService.showSimpleDanger(
                'errors.ERROR_NO_PRODUCT_IN_UNIT',
              );
            } else {
              this._store.dispatch(appCoreActions.gqlFailure({ error: err }));
            }

            this.workingGenerateStatus = false;
            this._changeDetectorRef.detectChanges();

            return EMPTY;
          }),
        )
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('update');

          this.workingGenerateStatus = false;
          this._changeDetectorRef.detectChanges();
        });
    }
  }
}
