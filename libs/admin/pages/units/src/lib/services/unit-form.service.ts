import { EMPTY, iif } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { ConfirmDialogComponent } from '@bgap/admin/shared/components';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { FormsService } from '@bgap/admin/shared/forms';
import {
  addressFormGroup,
  contactFormGroup,
  dailyScheduleBothEmptyOrProperlyFilledValidator,
  makeId,
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
  UpsertResponse,
} from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { select, Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';
import { Maybe } from '@bgap/crud-gql/api';

@Injectable({ providedIn: 'root' })
export class UnitFormService {
  constructor(
    private _formBuilder: FormBuilder,
    private _formsService: FormsService,
    private _store: Store,
    private _crudSdk: CrudSdkService,
    private _nbDialogService: NbDialogService,
    private _translateService: TranslateService,
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
      orderPolicy: [CrudApi.OrderPolicy.full],
      ...contactFormGroup(),
      ...addressFormGroup(this._formBuilder, true),
      pos: this._formBuilder.group({
        type: [CrudApi.PosType.anyupp],
        rkeeper: this._formsService.createRkeeperFormGroup(),
      }),
      externalId: [''],
      packagingTaxPercentage: [''],
      ratingPolicies: this._formBuilder.array([]),
      tipPolicy: this._formsService.createTipPolicyFormGroup(),
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

  public patchRatingPolicies(
    ratingPolicyValues: Maybe<CrudApi.RatingPolicy>[],
    ratingPoliciesArray: FormArray,
  ) {
    (ratingPolicyValues || []).forEach(ratingPolicyValue => {
      const ratingPolicyGroup =
        this._formsService.createRatingPolicyFormGroup();
      ratingPolicyGroup.patchValue(cleanObject(ratingPolicyValue || {}));
      ratingPoliciesArray.push(ratingPolicyGroup);
    });
  }

  public saveForm$(
    formValue: CrudApi.CreateUnitInput | CrudApi.UpdateUnitInput,
    isInitiallyRkeeper: boolean,
    unitId?: string,
  ) {
    formValue.packagingTaxPercentage = formValue.packagingTaxPercentage
      ? formValue.packagingTaxPercentage
      : 0;

    if (formValue.pos?.type !== CrudApi.PosType.rkeeper) {
      formValue.externalId = null;
    }

    return iif(
      () => !unitId,
      this.createUnit$({
        ...(<CrudApi.CreateUnitInput>formValue),
        isAcceptingOrders: false,
      }),
      this.updateUnit$(
        {
          ...formValue,
          id: unitId || '',
        },
        isInitiallyRkeeper,
      ),
    );
  }

  public updateRkeeperPassword$(unitId: string) {
    const anyuppPassword = makeId(8);

    return this.updateRKeeperData$({
      unitId,
      anyuppPassword,
    }).pipe(
      tap(() => {
        const dialog = this._nbDialogService.open(ConfirmDialogComponent);

        dialog.componentRef.instance.options = {
          message: this._translateService.instant(
            'units.rkeeperPasswordUpdated',
            { anyuppPassword },
          ),
          buttons: [
            {
              label: 'common.ok',
              callback: () => {
                dialog.close();
              },
              status: 'success',
            },
          ],
        };
      }),
    );
  }

  public createUnit$(input: CrudApi.CreateUnitInput) {
    return this._crudSdk.sdk.CreateUnit({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateUnit$(
    input: CrudApi.UpdateUnitInput,
    isInitiallyRkeeper: boolean,
  ) {
    return iif(
      () => isInitiallyRkeeper && input.pos?.type === CrudApi.PosType.rkeeper,
      // Save the RKeeper Unit data in 2 steps:
      // 1) update RKeeper data
      // 2) update the rest of the data
      this.updateRKeeperData$({
        unitId: input.id,
        ...input.pos?.rkeeper,
      }).pipe(
        switchMap((response: UpsertResponse<unknown>) => {
          if (response.type === 'update') {
            return this._crudSdk.sdk.UpdateUnit({
              input: {
                ...input,
                pos: undefined,
              },
            });
          }

          return EMPTY;
        }),
      ),
      this._crudSdk.sdk.UpdateUnit({ input }),
    ).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }

  public updateRKeeperData$(input: CrudApi.UpdateRKeeperDataInput) {
    return this._crudSdk.sdk.UpdateUnitRKeeperData({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }
}
