import { get as _get, omit as _omit, pick as _pick } from 'lodash-es';
import { take } from 'rxjs/operators';
import { PAYMENT_MODES, TIME_FORMAT_PATTERN } from '../../../../shared/const';
import {
  ICustomDailySchedule,
  IGroup,
  IKeyValue,
  IPaymentMode,
  IUnit,
} from '../../../../shared/interfaces';
import { AbstractFormDialogComponent } from '../../../../shared/modules/shared-forms/components/abstract-form-dialog/abstract-form-dialog.component';
import {
  contactFormGroup,
  multiLangValidator,
  unitOpeningHoursValidator,
} from '../../../../shared/pure';
import { FormsService } from '../../../../shared/services/forms';
import { EToasterType } from '../../../../shared/services/toaster';
import { IState } from '../../../../store';
import {
  currentUserSelectors,
  groupListSelectors,
} from '../../../../store/selectors';

/* eslint-disable @typescript-eslint/dot-notation */
import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-unit-form',
  templateUrl: './unit-form.component.html',
})
export class UnitFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public unit: IUnit;
  public paymentModes = PAYMENT_MODES;
  public groupOptions: IKeyValue[];
  private groups: IGroup[];
  private _store: Store<IState>;
  private _formsService: FormsService;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._store = this._injector.get(Store);
    this._formsService = this._injector.get(FormsService);
    this._store
      .pipe(
        select(groupListSelectors.getSelectedChainGroups),
        untilDestroyed(this)
      )
      .subscribe((groups: IGroup[]): void => {
        this.groups = groups;

        this.groupOptions = this.groups.map(
          (group: IGroup): IKeyValue => ({
            key: group._id,
            value: group.name,
          })
        );
      });
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      groupId: ['', [Validators.required]],
      chainId: ['', [Validators.required]],
      isActive: ['', [Validators.required]],
      name: ['', [Validators.required]],
      description: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator }
      ),
      paymentModes: [[]],
      ...contactFormGroup(this._formBuilder),
      open: this._formBuilder.group({
        from: [''],
        to: [''],
      }),
      openingHours: this._formBuilder.group(
        {
          mon: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          tue: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          wed: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          thu: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          fri: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          sat: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          sun: this._formBuilder.group({
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          }),
          override: this._formBuilder.array([]),
        },
        { validators: unitOpeningHoursValidator }
      ),
      _lanesArr: this._formBuilder.array([]), // temp array!
    });

    if (this.unit) {
      this.dialogForm.patchValue(this.unit);

      // Parse openingHours object to temp array
      const override: ICustomDailySchedule[] = _get(
        this.unit,
        'openingHours.override'
      );
      if (override) {
        override.forEach((day: ICustomDailySchedule): void => {
          const dayGroup = this._formsService.createCustomDailyScheduleFormGroup();
          dayGroup.patchValue(day);

          this.dialogForm.controls.openingHours['controls'].override.push(
            dayGroup
          );
        });
      }

      // Parse lanes object to temp array
      Object.keys(this.unit.lanes || {}).forEach((key: string): void => {
        const laneGroup = this._formsService.createLaneFormGroup();
        laneGroup.patchValue({
          _laneId: key,
          ...this.unit.lanes[key],
        });
        (this.dialogForm.controls._lanesArr as FormArray).push(laneGroup);
      });
    } else {
      // Patch ChainId
      this._store
        .pipe(select(currentUserSelectors.getSelectedChainId), take(1))
        .subscribe((selectedChainId: string): void => {
          if (selectedChainId) {
            this.dialogForm.controls.chainId.patchValue(selectedChainId);
          }
        });

      // Patch GroupId
      this._store
        .pipe(select(currentUserSelectors.getSelectedGroupId), take(1))
        .subscribe((selectedGroupId: string): void => {
          if (selectedGroupId) {
            this.dialogForm.controls.groupId.patchValue(selectedGroupId);
          }
        });

      this.dialogForm.controls.isActive.patchValue(false);
    }
  }

  public submit(): void {
    if (this.dialogForm.valid) {
      const value = {
        ...this.dialogForm.value,
        lanes: {},
      };

      value._lanesArr.map((lane): void => {
        value.lanes[lane._laneId] = _omit(lane, '_laneId');
      });

      delete value._lanesArr;

      if (_get(this.unit, '_id')) {
        this._dataService.updateUnit(this.unit._id, value).then(
          (): void => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.updateSuccessful'
            );
            this.close();
          },
          (err) => {
            console.error('GROUP UPDATE ERROR', err);
          }
        );
      } else {
        this._dataService.insertUnit(value).then(
          (): void => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.insertSuccessful'
            );
            this.close();
          },
          (err) => {
            console.error('GROUP INSERT ERROR', err);
          }
        );
      }
    }
  }

  public paymentModeIsChecked(paymentMode: IPaymentMode): boolean {
    return (
      (this.dialogForm.value.paymentModes || [])
        .map((m): string => m.name)
        .indexOf(paymentMode.name) >= 0
    );
  }

  public togglePaymentMode(paymentMode: IPaymentMode): void {
    const paymentModesArr: IPaymentMode[] = this.dialogForm.value.paymentModes;
    const idx = paymentModesArr
      .map((m): string => m.name)
      .indexOf(paymentMode.name);

    if (idx < 0) {
      paymentModesArr.push(_pick(paymentMode, ['name', 'method']));
    } else {
      paymentModesArr.splice(idx, 1);
    }
    this.dialogForm.controls.paymentModes.setValue(paymentModesArr);
  }
}
