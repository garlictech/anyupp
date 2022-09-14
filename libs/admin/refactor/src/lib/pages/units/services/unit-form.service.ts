import { cloneDeep } from 'lodash/fp';
import { filterNullish } from '@bgap/shared/utils';
import { EMPTY, iif } from 'rxjs';
import { map, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { Maybe } from '@bgap/crud-gql/api';
import {
  ChainStyleImages,
  CreateUnitInput,
  OrderPaymentPolicy,
  OrderPolicy,
  PosType,
  RatingPolicy,
  SoldOutVisibilityPolicy,
  Unit,
  UpdateRKeeperDataInput,
  UpdateUnitInput,
} from '@bgap/domain';
import {
  defaultOrderMode,
  defaultServingMode,
  UpsertResponse,
} from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { NbDialogService } from '@nebular/theme';
import { Store } from '@ngrx/store';
import { TranslateService } from '@ngx-translate/core';

import { ConfirmDialogComponent } from '../../../shared/components';
import { CrudSdkService } from '../../../shared/data-access/sdk';
import { FormsService } from '../../../shared/forms';
import {
  addressFormGroup,
  contactFormGroup,
  dailyScheduleBothEmptyOrProperlyFilledValidator,
  locationFormGroup,
  makeId,
  multiLangValidator,
  notEmptyArray,
  TIME_FORMAT_PATTERN,
} from '../../../shared/utils';
import { catchGqlError } from '../../../store/app-core';
import { UnitCollectionService } from '../../../store/units';

@Injectable({ providedIn: 'root' })
export class UnitFormService {
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _formsService: FormsService,
    private _store: Store,
    private _crudSdk: CrudSdkService,
    private _nbDialogService: NbDialogService,
    private _translateService: TranslateService,
    private _unitCollectionService: UnitCollectionService,
  ) {}

  public createUnitFormGroup() {
    return this._formBuilder.group({
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
      orderPaymentPolicy: [OrderPaymentPolicy.prepay],
      supportedServingModes: [
        [defaultServingMode],
        { validators: notEmptyArray },
      ],
      supportedOrderModes: [[defaultOrderMode], { validators: notEmptyArray }],
      orderPolicy: [OrderPolicy.full],
      soldOutVisibilityPolicy: [SoldOutVisibilityPolicy.faded],
      ...contactFormGroup(),
      ...addressFormGroup(this._formBuilder, true),
      ...locationFormGroup(this._formBuilder, true),
      pos: this._formBuilder.group({
        type: [PosType.anyupp],
        rkeeper: this._formsService.createRkeeperFormGroup(),
      }),
      style: this._formBuilder.group({
        colors: this._formBuilder.group({
          button: ['#30bf60', [Validators.required]],
          buttonText: ['#ffffff', [Validators.required]],
          icon: ['#30bf60', [Validators.required]],
          highlight: ['#30bf60', [Validators.required]],
        }),
        images: this._formBuilder.group({
          logo: [''],
          header: [''],
        }),
      }),
      currency: ['', [Validators.required]],
      externalId: [''],
      merchantId: [''],
      packagingTaxPercentage: [''],
      canRequestVatInvoice: [true],
      canCallWaiter: [false],
      isVisibleInApp: [true],
      ratingPolicies: this._formBuilder.array([]),
      tipPolicy: this._formsService.createTipPolicyFormGroup(),
      serviceFeePolicy: this._formsService.createServiceFeePolicyFormGroup(),
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

  public getUnitOptions$() {
    return this._unitCollectionService.filteredEntities$.pipe(
      map(units =>
        units.map(unit => ({
          key: unit.id,
          value: unit.name,
        })),
      ),
    );
  }

  public patchRatingPolicies(
    ratingPolicyValues: Maybe<RatingPolicy>[],
    ratingPoliciesArray: UntypedFormArray,
  ) {
    (ratingPolicyValues || []).forEach(ratingPolicyValue => {
      const ratingPolicyGroup =
        this._formsService.createRatingPolicyFormGroup();
      ratingPolicyGroup.patchValue(cleanObject(ratingPolicyValue || {}));
      ratingPoliciesArray.push(ratingPolicyGroup);
    });
  }

  public saveForm$(
    formValue: CreateUnitInput | UpdateUnitInput,
    isInitiallyRkeeper: boolean,
    unitId?: string,
  ) {
    // Some cleanup
    formValue.packagingTaxPercentage = formValue.packagingTaxPercentage
      ? formValue.packagingTaxPercentage
      : 0;

    if (formValue.address) {
      formValue.address = {
        ...formValue.address,
      };
    }

    if (formValue.pos?.type !== PosType.rkeeper) {
      formValue.externalId = null;
    }

    if (!formValue.serviceFeePolicy?.type) {
      formValue.serviceFeePolicy = null;
    }

    return iif(
      () => !unitId,
      this.createUnit$({
        ...(<CreateUnitInput>formValue),
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

  public createUnit$(input: CreateUnitInput) {
    return this._unitCollectionService.add$<CreateUnitInput>(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateUnit$(input: UpdateUnitInput, isInitiallyRkeeper: boolean) {
    return iif(
      () => isInitiallyRkeeper && input.pos?.type === PosType.rkeeper,
      // Save the RKeeper Unit data in 2 steps:
      // 1) update RKeeper data
      // 2) update the rest of the data
      this.updateRKeeperData$({
        unitId: input.id,
        ...input.pos?.rkeeper,
      }).pipe(
        switchMap((response: UpsertResponse<unknown>) => {
          if (response.type === 'update') {
            return this._unitCollectionService.update$<UpdateUnitInput>({
              ...input,
              pos: undefined,
            });
          }

          return EMPTY;
        }),
      ),
      this._unitCollectionService.update$<UpdateUnitInput>(input),
    ).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }

  public updateRKeeperData$(input: UpdateRKeeperDataInput) {
    return this._crudSdk.sdk.UpdateUnitRKeeperData({ input }).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }

  public updateImageStyles$(unitId: string, param: string, image?: string) {
    return this._unitCollectionService.getByKey$(unitId, true, true).pipe(
      filterNullish(),
      switchMap(data => {
        const _data: Unit = cloneDeep(data);
        const unitStyleImagesRecord: Record<string, keyof ChainStyleImages> = {
          header: 'header',
          logo: 'logo',
        };

        if (!_data.style.images) {
          _data.style.images = {};
        }

        if (unitStyleImagesRecord[param]) {
          _data.style.images[unitStyleImagesRecord[param]] = image;
        }

        return this._unitCollectionService.update$<UpdateUnitInput>({
          id: _data.id,
          style: _data.style,
        });
      }),
      catchGqlError(this._store),
    );
  }
}
