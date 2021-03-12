import { map, take } from 'rxjs/operators';
import { v1 as uuidV1 } from 'uuid';

import { Injectable } from '@angular/core';
import {
  AbstractControl,
  AsyncValidatorFn,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { adminUsersSelectors } from '@bgap/admin/shared/data-access/admin-users';
import {
  TIME_FORMAT_PATTERN,
  multiLangValidator,
  productAvailabilityValidator,
} from '@bgap/admin/shared/utils';
import { EVariantAvailabilityType, IAdminUser } from '@bgap/shared/types';
import { select, Store } from '@ngrx/store';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(private _store: Store<any>, private _formBuilder: FormBuilder) {}

  public createProductVariantFormGroup = (): FormGroup => {
    const groupConfig = {
      id: [uuidV1()],
      variantName: this._formBuilder.group(
        {
          hu: ['', Validators.maxLength(40)],
          en: ['', Validators.maxLength(40)],
          de: ['', Validators.maxLength(40)],
        },
        { validators: multiLangValidator },
      ),
      pack: this._formBuilder.group({
        size: [''],
        unit: [''],
      }),
      isAvailable: [true],
      availabilities: this._formBuilder.array([]),
      position: [''],
      refGroupPrice: [''],
    };

    return this._formBuilder.group(groupConfig);
  };

  public createProductAvailabilityFormGroup = (): FormGroup => {
    return this._formBuilder.group(
      {
        type: [EVariantAvailabilityType.ALWAYS, [Validators.required]],
        dayFrom: [''],
        dayTo: [''],
        timeFrom: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
        timeTo: ['', [Validators.pattern(TIME_FORMAT_PATTERN)]],
        price: ['', [Validators.required]],
      },
      { validators: productAvailabilityValidator },
    );
  };

  public createCustomDailyScheduleFormGroup = (): FormGroup => {
    return this._formBuilder.group({
      date: ['', [Validators.required]],
      from: [
        '',
        [Validators.required, Validators.pattern(TIME_FORMAT_PATTERN)],
      ],
      to: ['', [Validators.required, Validators.pattern(TIME_FORMAT_PATTERN)]],
    });
  };

  public createLaneFormGroup = (): FormGroup => {
    return this._formBuilder.group({
      id: [uuidV1()],
      name: ['', [Validators.required]],
      color: ['#fff', [Validators.required]],
    });
  };

  public adminExistingEmailValidator(
    control: AbstractControl,
  ): AsyncValidatorFn {
    return () => {
      return this._store.pipe(
        select(adminUsersSelectors.getAdminUserByEmail(control.value)),
        take(1),
        map((adminUser: IAdminUser | undefined) => {
          return adminUser ? { err: 'ADMIN_USER_EXISTS' } : null;
        }),
      );
    };
  }
}
