import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ConfirmDialogComponent } from '@bgap/admin/shared/components';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import * as CrudApi from '@bgap/crud-gql/api';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';
import { cleanObject } from '@bgap/shared/utils';
import { pick } from 'lodash/fp';
import { UnitFormService } from '../../services/unit-form.service';
import { UpsertResponse } from '@bgap/shared/types';
import { switchMap } from 'rxjs/operators';
import { EMPTY } from 'rxjs';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unit-rkeeper-form',
  templateUrl: './unit-rkeeper-form.component.html',
})
export class UnitRkeeperFormComponent
  extends AbstractFormDialogComponent
  implements OnInit, OnDestroy
{
  public unit!: CrudApi.Unit;

  private _isInitiallyRkeeper = false;

  constructor(
    protected _injector: Injector,
    private _nbDialogService: NbDialogService,
    private _unitFormService: UnitFormService,
  ) {
    super(_injector);
  }

  ngOnInit(): void {
    this.dialogForm = this._unitFormService.createUnitRkeeperFormGroup();

    this.dialogForm.patchValue(
      cleanObject(pick(['externalId', 'pos'], this.unit)),
    );

    if (this.unit.pos?.type === CrudApi.PosType.rkeeper) {
      this._isInitiallyRkeeper = true;

      (<FormGroup>this.dialogForm.controls['pos']).controls['rkeeper'].enable();
    }
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public submit() {
    if (this.dialogForm?.valid) {
      if (
        this._isInitiallyRkeeper &&
        this.dialogForm?.value.pos?.type !== CrudApi.PosType.rkeeper
      ) {
        const dialog = this._nbDialogService.open(ConfirmDialogComponent);

        dialog.componentRef.instance.options = {
          message: 'units.rkeeperDeletionAlert',
          buttons: [
            {
              label: 'common.ok',
              callback: (): void => {
                this._saveForm();
              },
              status: 'success',
            },
            {
              label: 'common.cancel',
              status: 'basic',
            },
          ],
        };
      } else {
        this._saveForm();
      }
    }
  }

  private _saveForm() {
    this._unitFormService
      .updateRKeeperData$({
        unitId: this.unit?.id,
        ...this.dialogForm.value.pos.rkeeper,
      })
      .pipe(
        switchMap((response: UpsertResponse<unknown>) => {
          if (response.type === 'update') {
            return this._unitFormService.updateUnit$({
              id: this.unit?.id,
              externalId: this.dialogForm.value.externalId,
            });
          }

          return EMPTY;
        }),
      )
      .subscribe((response: UpsertResponse<unknown>) => {
        this._toasterService.showSimpleSuccess(response.type);

        this.close();
      });
  }

  public updatePassword() {
    this._unitFormService.updateRkeeperPassword$(this.unit?.id).subscribe();
  }
}
