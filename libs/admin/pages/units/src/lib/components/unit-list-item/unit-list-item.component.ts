import { cloneDeep } from 'lodash/fp';
import { EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { appCoreActions } from '@bgap/admin/store/app-core';
import { DataService } from '@bgap/admin/shared/data-access/data';
import { ToasterService } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { jsonParsedOrNull } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';

import { UnitFloorMapComponent } from '../unit-floor-map/unit-floor-map.component';
import { UnitFormComponent } from '../unit-form/unit-form.component';
import { UnitRkeeperFormComponent } from '../unit-rkeeper-form/unit-rkeeper-form.component';

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

  public editUnit(): void {
    const dialog = this._nbDialogService.open(UnitFormComponent);

    if (this.unit) {
      dialog.componentRef.instance.unit = cloneDeep(this.unit);
    }
  }

  public editRkeeperUnit(): void {
    const dialog = this._nbDialogService.open(UnitRkeeperFormComponent);

    if (this.unit) {
      dialog.componentRef.instance.unit = cloneDeep(this.unit);
    }
  }

  public editUnitFloorMap(): void {
    const dialog = this._nbDialogService.open(UnitFloorMapComponent);

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
