import { iif } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { FormsService } from '@bgap/admin/shared/forms';
import {
  addressFormGroup,
  contactFormGroup,
  dailyScheduleBothEmptyOrProperlyFilledValidator,
  multiLangValidator,
  notEmptyArray,
  TIME_FORMAT_PATTERN,
} from '@bgap/admin/shared/utils';
import { catchGqlError } from '@bgap/admin/store/app-core';
import { groupsSelectors } from '@bgap/admin/store/groups';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  defaultOrderMode,
  defaultServingMode,
  KeyValue,
} from '@bgap/shared/types';
import { select, Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class UnitFormService {
  constructor(
    private _formBuilder: FormBuilder,
    private _formsService: FormsService,
    private _store: Store,
    private _crudSdk: CrudSdkService,
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
      packagingTax: [''],
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

  public getGroupOptions$() {
    return this._store.pipe(
      select(groupsSelectors.getSelectedChainGroups),
      map((groups: CrudApi.Group[]) =>
        groups.map(
          (group: CrudApi.Group): KeyValue => ({
            key: group.id,
            value: group.name,
          }),
        ),
      ),
    );
  }

  public saveForm$(
    formValue: CrudApi.CreateUnitInput | CrudApi.UpdateUnitInput,
    unitId?: string,
  ) {
    if (formValue.pos?.type !== CrudApi.PosType.rkeeper) {
      delete formValue.pos?.rkeeper;
    }

    return iif(
      () => !unitId,
      this.createUnit$({
        ...(<CrudApi.CreateUnitInput>formValue),
        isAcceptingOrders: false,
      }),
      this.updateUnit$({
        ...formValue,
        id: unitId || '',
      }),
    );
  }

  public createUnit$(input: CrudApi.CreateUnitInput) {
    return this._crudSdk.sdk.CreateUnit({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateUnit$(input: CrudApi.UpdateUnitInput) {
    return this._crudSdk.sdk.UpdateUnit({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }
}
