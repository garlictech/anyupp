import { cloneDeep, omit, pick } from 'lodash/fp';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import { PaymentMode, PosType, Unit } from '@bgap/domain';
import { KeyValue, UpsertResponse } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { UntilDestroy } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';
import { timeZonesNames } from '@vvo/tzdb';

import { ConfirmDialogComponent } from '../../../../shared/components';
import {
  AbstractFormDialogComponent,
  FormsService,
} from '../../../../shared/forms';
import {
  makeId,
  ORDER_MODES,
  PAYMENT_MODES,
  SERVING_MODES,
} from '../../../../shared/utils';
import { loggedUserSelectors } from '../../../../store/logged-user';
import {
  orderPaymentPolicyOptions,
  orderPolicyOptions,
  soldOutPolicyOptions,
} from '../../const';
import { UnitFormService } from '../../services/unit-form.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-unit-form',
  templateUrl: './unit-form.component.html',
})
export class UnitFormComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public unit!: Unit;
  public paymentModes = PAYMENT_MODES;
  public servingModes = SERVING_MODES;
  public orderModes = ORDER_MODES;
  public unitOptions$: Observable<KeyValue[]>;
  public timeZoneOptions: KeyValue[] = [];
  public orderPolicyOptions: KeyValue[] = orderPolicyOptions;
  public soldOutPolicyOptions: KeyValue[] = soldOutPolicyOptions;
  public orderPaymentPolicyOptions: KeyValue[] = orderPaymentPolicyOptions;
  public isInitiallyRkeeper = false;
  public currencyOptions: KeyValue[] = [];

  constructor(
    protected override _injector: Injector,
    private _formsService: FormsService,
    private _nbDialogService: NbDialogService,
    private _unitFormService: UnitFormService,
  ) {
    super(_injector);

    this.timeZoneOptions = timeZonesNames.map(n => ({
      key: n,
      value: n,
    }));

    this.unitOptions$ = this._unitFormService.getUnitOptions$();
  }

  get logoImage() {
    return this.unit?.style?.images?.logo;
  }

  get headerImage() {
    return this.unit?.style?.images?.header;
  }

  ngOnInit() {
    this.dialogForm = this._unitFormService.createUnitFormGroup();

    this.currencyOptions = ['EUR', 'HUF'].map(currency => ({
      key: currency,
      value: currency,
    }));

    if (this.unit) {
      this.dialogForm.patchValue(cleanObject(omit(['lanes'], this.unit)));

      // Setup RKeeper form for updating
      if (this.unit.pos?.type === PosType.rkeeper) {
        this.isInitiallyRkeeper = true;

        this.dialogForm.get('pos.rkeeper')?.enable();
        this.dialogForm.get('pos.rkeeper.anyuppPassword')?.disable();
      }

      this._unitFormService.patchRatingPolicies(
        this.unit.ratingPolicies || [],
        this.dialogForm?.controls['ratingPolicies'] as FormArray,
      );

      // Parse openingHours object to temp array
      const custom = this.unit?.openingHours?.custom;

      if (custom) {
        custom.forEach(day => {
          if (day) {
            const dayunit =
              this._formsService.createCustomDailyScheduleFormGroup();
            dayunit.patchValue(day);

            (<FormArray>(
              this.dialogForm?.get('openingHours')?.get('custom')
            )).push(dayunit);
          }
        });
      }

      // Patch lanes array
      (this.unit.lanes || []).forEach(lane => {
        if (lane) {
          const laneunit = this._formsService.createLaneFormGroup();
          laneunit.patchValue(lane);
          (<FormArray>this.dialogForm?.get('lanes')).push(laneunit);
        }
      });
    } else {
      // Patch unitId
      this._store
        .pipe(select(loggedUserSelectors.getSelectedUnitId), take(1))
        .subscribe((selectedUnitId: string | undefined | null) => {
          if (selectedUnitId) {
            this.dialogForm?.patchValue({ unitId: selectedUnitId });
          }
        });

      this.dialogForm.patchValue({ isActive: false });
    }
  }

  public submit() {
    if (this.dialogForm?.valid) {
      if (
        this.isInitiallyRkeeper &&
        this.dialogForm?.value.pos?.type !== PosType.rkeeper
      ) {
        const dialog = this._nbDialogService.open(ConfirmDialogComponent);

        dialog.componentRef.instance.options = {
          message: 'units.rkeeperDeletionAlert',
          buttons: [
            {
              label: 'common.ok',
              callback: () => {
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
    this.setWorking$(true)
      .pipe(
        switchMap(() =>
          this._unitFormService.saveForm$(
            cloneDeep(this.dialogForm?.value),
            this.isInitiallyRkeeper,
            this.unit?.id,
          ),
        ),
        tap(() => this.setWorking$(false)),
      )
      .subscribe((response: UpsertResponse<unknown>) => {
        this._toasterService.showSimpleSuccess(response.type);

        this.close();
      });
  }

  public paymentModeIsChecked = (paymentMode: PaymentMode) =>
    (this.dialogForm?.value.paymentModes || [])
      .map((m: { type: string }) => m.type)
      .indexOf(paymentMode.type) >= 0;

  public togglePaymentMode(paymentMode: PaymentMode) {
    const paymentModesArr = this.dialogForm?.value.paymentModes;
    const idx = paymentModesArr
      .map((m: { type: string }) => m.type)
      .indexOf(paymentMode.type);

    if (idx < 0) {
      paymentModesArr.push(pick(['type', 'method'], paymentMode));
    } else {
      paymentModesArr.splice(idx, 1);
    }

    this.dialogForm?.controls['paymentModes'].setValue(paymentModesArr);
  }

  public generatePassword() {
    if (this.unit && this.isInitiallyRkeeper) {
      this._unitFormService.updateRkeeperPassword$(this.unit?.id).subscribe();
    } else {
      this.dialogForm?.get('pos.rkeeper.anyuppPassword')?.patchValue(makeId(8));
    }
  }

  public logoUploadCallback = (image: string, param: string) => {
    (<FormControl>(
      this.dialogForm?.get('style')?.get('images')?.get(param)
    )).setValue(image);

    if (this.unit?.id) {
      this._unitFormService
        .updateImageStyles$(this.unit?.id, param, image)
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('imageUpload');
        });
    } else {
      this._toasterService.showSimpleSuccess('imageUpload');
    }
  };

  public logoRemoveCallback = (param: string) => {
    (<FormControl>(
      this.dialogForm?.get('style')?.get('images')?.get(param)
    )).setValue('');

    if (this.unit?.id) {
      this._unitFormService
        .updateImageStyles$(this.unit?.id, param)
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('imageRemove');
        });
    } else {
      this._toasterService.showSimpleSuccess('imageRemove');
    }
  };
}
