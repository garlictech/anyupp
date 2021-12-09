import { omit, pick } from 'lodash/fp';
import { delay, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';
import { ConfirmDialogComponent } from '@bgap/admin/shared/components';
import { groupsSelectors } from '@bgap/admin/shared/data-access/groups';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import {
  AbstractFormDialogComponent,
  FormsService,
} from '@bgap/admin/shared/forms';
import {
  ORDER_MODES,
  PAYMENT_MODES,
  SERVING_MODES,
} from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';
import { timeZonesNames } from '@vvo/tzdb';

import { UnitFormService } from '../../services/unit-form.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unit-form',
  templateUrl: './unit-form.component.html',
})
export class UnitFormComponent
  extends AbstractFormDialogComponent
  implements OnInit, OnDestroy
{
  public unit!: CrudApi.Unit;
  public paymentModes = PAYMENT_MODES;
  public servingModes = SERVING_MODES;
  public orderModes = ORDER_MODES;
  public groupOptions: KeyValue[] = [];
  public timeZoneOptions: KeyValue[] = [];

  private _isInitiallyRkeeper = false;
  private _groups: CrudApi.Group[] = [];

  constructor(
    protected _injector: Injector,
    private _formsService: FormsService,
    private _nbDialogService: NbDialogService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _unitFormService: UnitFormService,
  ) {
    super(_injector);

    this.dialogForm = this._unitFormService.createUnitFormGroup();
    this.timeZoneOptions = timeZonesNames.map(n => ({
      key: n,
      value: n,
    }));
  }

  ngOnInit(): void {
    if (this.unit) {
      this.dialogForm.patchValue(cleanObject(omit(['lanes'], this.unit)));

      if (this.unit.pos?.type === CrudApi.PosType.rkeeper) {
        this._isInitiallyRkeeper = true;

        (<FormGroup>this.dialogForm.controls['pos']).controls[
          'rkeeper'
        ].enable();
      }

      // Parse openingHours object to temp array
      const custom = this.unit?.openingHours?.custom;

      if (custom) {
        custom.forEach(day => {
          if (day) {
            const dayGroup =
              this._formsService.createCustomDailyScheduleFormGroup();
            dayGroup.patchValue(day);

            (<FormArray>(
              this.dialogForm?.get('openingHours')?.get('custom')
            )).push(dayGroup);
          }
        });
      }

      // Patch lanes array
      (this.unit.lanes || []).forEach(lane => {
        if (lane) {
          const laneGroup = this._formsService.createLaneFormGroup();
          laneGroup.patchValue(lane);
          (<FormArray>this.dialogForm?.get('lanes')).push(laneGroup);
        }
      });
    } else {
      // Patch ChainId
      this._store
        .pipe(
          select(loggedUserSelectors.getSelectedChainId),
          take(1),
          delay(200),
        )
        .subscribe((selectedChainId: string | undefined | null): void => {
          if (selectedChainId) {
            this.dialogForm.patchValue({ chainId: selectedChainId });

            this._changeDetectorRef.detectChanges();
          }
        });

      // Patch GroupId
      this._store
        .pipe(select(loggedUserSelectors.getSelectedGroupId), take(1))
        .subscribe((selectedGroupId: string | undefined | null): void => {
          if (selectedGroupId) {
            this.dialogForm.patchValue({ groupId: selectedGroupId });
          }
        });

      this.dialogForm.patchValue({ isActive: false });
    }

    this._store
      .pipe(
        select(groupsSelectors.getSelectedChainGroups),
        untilDestroyed(this),
      )
      .subscribe((groups: CrudApi.Group[]): void => {
        this._groups = groups;

        this.groupOptions = this._groups.map(
          (group: CrudApi.Group): KeyValue => ({
            key: group.id,
            value: group.name,
          }),
        );

        this._changeDetectorRef.detectChanges();
      });
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
                this._unitFormService.saveForm(
                  this.dialogForm.value,
                  this.unit.id,
                );
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
        this._unitFormService.saveForm(this.dialogForm.value, this.unit?.id);
      }
    }
  }

  public paymentModeIsChecked(paymentMode: CrudApi.PaymentMode): boolean {
    return (
      (this.dialogForm?.value.paymentModes || [])
        .map((m: { type: string }) => m.type)
        .indexOf(paymentMode.type) >= 0
    );
  }

  public togglePaymentMode(paymentMode: CrudApi.PaymentMode): void {
    const paymentModesArr = this.dialogForm?.value.paymentModes;
    const idx = paymentModesArr
      .map((m: { type: string }) => m.type)
      .indexOf(paymentMode.type);

    if (idx < 0) {
      paymentModesArr.push(pick(['type', 'method'], paymentMode));
    } else {
      paymentModesArr.splice(idx, 1);
    }

    this.dialogForm?.controls.paymentModes.setValue(paymentModesArr);
  }
}
