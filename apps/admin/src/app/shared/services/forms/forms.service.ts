import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { IState } from '../../../store';
import { adminUserListSelectors } from '../../../store/selectors';
import { v1 as uuidV1 } from 'uuid';

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { select, Store } from '@ngrx/store';

import { TIME_FORMAT_PATTERN } from '../../const';
import { EVariantAvailabilityType } from '@bgap/shared/types';
import { multiLangValidator, productAvailabilityValidator } from '../../pure';
import { IAdminUser } from '@bgap/shared/types';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  constructor(
    private _store: Store<IState>,
    private _formBuilder: FormBuilder
  ) {}

  public createProductVariantFormGroup = (): FormGroup => {
    const groupConfig = {
      _variantId: [uuidV1()],
      variantName: this._formBuilder.group(
        {
          hu: ['', Validators.maxLength(40)],
          en: ['', Validators.maxLength(40)],
          de: ['', Validators.maxLength(40)],
        },
        { validators: multiLangValidator }
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
      { validators: productAvailabilityValidator }
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
      _laneId: [uuidV1()],
      name: ['', [Validators.required]],
      color: ['#fff', [Validators.required]],
    });
  };

  public adminExistingEmailValidator = (control: FormGroup): Observable<IAdminUser> =>
    this._store.pipe(
      select(adminUserListSelectors.getAdminUserByEmail(control.value)),
      take(1)
    );
}
