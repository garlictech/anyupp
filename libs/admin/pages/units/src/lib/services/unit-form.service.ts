import { cloneDeep } from 'lodash/fp';

import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { unitsActions } from '@bgap/admin/shared/data-access/units';
import { FormsService } from '@bgap/admin/shared/forms';
import {
  addressFormGroup,
  contactFormGroup,
  dailyScheduleBothEmptyOrProperlyFilledValidator,
  multiLangValidator,
  notEmptyArray,
  TIME_FORMAT_PATTERN,
} from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { defaultOrderMode, defaultServingMode } from '@bgap/shared/types';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class UnitFormService {
  constructor(
    private _formBuilder: FormBuilder,
    private _formsService: FormsService,
    private _store: Store,
  ) {}

  public createUnitFormGroup() {
    return this._formBuilder.group({
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
        { validators: multiLangValidator },
      ),
      timeZone: [''],
      paymentModes: [[]],
      supportedServingModes: [
        [defaultServingMode],
        { validators: notEmptyArray },
      ],
      supportedOrderModes: [[defaultOrderMode], { validators: notEmptyArray }],
      ...contactFormGroup(),
      ...addressFormGroup(this._formBuilder, true),
      pos: this._formBuilder.group({
        type: [CrudApi.PosType.anyupp],
        rkeeper: this._formsService.createRkeeperFormGroup(),
      }),
      open: this._formBuilder.group({
        from: [''],
        to: [''],
      }),
      openingHours: this._formBuilder.group({
        mon: this._formBuilder.group(
          {
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          },
          {
            validators: [dailyScheduleBothEmptyOrProperlyFilledValidator],
          },
        ),
        tue: this._formBuilder.group(
          {
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          },
          {
            validators: [dailyScheduleBothEmptyOrProperlyFilledValidator],
          },
        ),
        wed: this._formBuilder.group(
          {
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          },
          {
            validators: [dailyScheduleBothEmptyOrProperlyFilledValidator],
          },
        ),
        thu: this._formBuilder.group(
          {
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          },
          {
            validators: [dailyScheduleBothEmptyOrProperlyFilledValidator],
          },
        ),
        fri: this._formBuilder.group(
          {
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          },
          {
            validators: [dailyScheduleBothEmptyOrProperlyFilledValidator],
          },
        ),
        sat: this._formBuilder.group(
          {
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          },
          {
            validators: [dailyScheduleBothEmptyOrProperlyFilledValidator],
          },
        ),
        sun: this._formBuilder.group(
          {
            from: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
            to: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
          },
          {
            validators: [dailyScheduleBothEmptyOrProperlyFilledValidator],
          },
        ),
        custom: this._formBuilder.array([]),
      }),
      lanes: this._formBuilder.array([]),
    });
  }

  public saveForm(
    formValue: CrudApi.CreateUnitInput | CrudApi.UpdateUnitInput,
    unitId?: string,
  ) {
    const value = cloneDeep(formValue);

    if (value.pos?.type !== CrudApi.PosType.rkeeper) {
      delete value.pos?.rkeeper;
    }

    if (unitId) {
      this._store.dispatch(
        unitsActions.updateUnit({
          formValue: <CrudApi.UpdateUnitInput>{
            ...value,
            id: unitId,
          },
        }),
      );
    } else {
      this._store.dispatch(
        unitsActions.createUnit({
          formValue: <CrudApi.CreateUnitInput>{
            ...value,
            isAcceptingOrders: false,
          },
        }),
      );
    }
  }
}
