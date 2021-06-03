import { v1 as uuidV1 } from 'uuid';

import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  multiLangValidator,
  productAvailabilityValidator,
  TIME_FORMAT_PATTERN,
} from '@bgap/admin/shared/utils';
import { EVariantAvailabilityType } from '@bgap/shared/types';

@Injectable({
  providedIn: 'root',
})
export class FormsService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(/*private _store: Store,*/ private _formBuilder: FormBuilder) {}

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
        size: [0],
        unit: [''],
      }),
      isAvailable: [true],
      availabilities: this._formBuilder.array([]),
      position: [0],
      price: [0],
      refGroupPrice: [0],
    };

    return this._formBuilder.group(groupConfig);
  };

  public createProductAvailabilityFormGroup = (): FormGroup =>
    this._formBuilder.group(
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

  public createCustomDailyScheduleFormGroup = (): FormGroup =>
    this._formBuilder.group({
      date: ['', [Validators.required]],
      from: [
        '',
        [Validators.required, Validators.pattern(TIME_FORMAT_PATTERN)],
      ],
      to: ['', [Validators.required, Validators.pattern(TIME_FORMAT_PATTERN)]],
    });

  public createLaneFormGroup = (): FormGroup =>
    this._formBuilder.group({
      id: [uuidV1()],
      name: ['', [Validators.required]],
      color: ['#ffffff', [Validators.required]],
    });

  public createProductConfigSetFormGroup = (): FormGroup =>
    this._formBuilder.group({
      productSetId: [''],
      items: this._formBuilder.array([]),
      position: [0],
    });

  public createProductConfigSetItemFormGroup = (): FormGroup =>
    this._formBuilder.group({
      productComponentId: ['', Validators.required],
      position: [0, Validators.required],
      refGroupPrice: [0, Validators.required],
      price: [0, Validators.required],
    });
}
