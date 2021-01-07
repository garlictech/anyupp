import { WEEKLY_VARIANT_AVAILABILITY } from 'src/app/shared/const';
import { EVariantAvailabilityType } from 'src/app/shared/enums';
import { IKeyValue } from 'src/app/shared/interfaces';
import { FormsService } from 'src/app/shared/services/forms';

import { Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-form-product-availabilities',
  templateUrl: './form-product-availabilities.component.html',
})
export class FormProductAvailabilitiesComponent {
  @Input() availabilityFormArray: FormArray;
  @Input() currency?: string;
  public EVariantAvailabilityType = EVariantAvailabilityType;
  public iterativeAvailabilities: IKeyValue[];

  constructor(
    private _formsService: FormsService,
    private _translateService: TranslateService
  ) {
    this.iterativeAvailabilities = Object.keys(WEEKLY_VARIANT_AVAILABILITY).map(
      (key): IKeyValue => ({
        key,
        value: this._translateService.instant(WEEKLY_VARIANT_AVAILABILITY[key]),
      })
    );
  }

  public availabilityTypes = [
    {
      key: EVariantAvailabilityType.ALWAYS,
      value: this._translateService.instant('products.always'),
    },
    {
      key: EVariantAvailabilityType.WEEKLY,
      value: this._translateService.instant('products.weekly'),
    },
    {
      key: EVariantAvailabilityType.SEASONAL,
      value: this._translateService.instant('products.seasonal'),
    },
  ];

  public addAvailability(): void {
    this.availabilityFormArray.push(
      this._formsService.createProductAvailabilityFormGroup()
    );
  }

  public removeAvailability(idx: number): void {
    this.availabilityFormArray.removeAt(idx);
  }

  public onTypeChange(value: EVariantAvailabilityType, idx: number): void {
    // Clear days
    this.availabilityFormArray.controls[idx].patchValue({
      dayFrom: '',
      dayTo: '',
    });

    if (value === EVariantAvailabilityType.ALWAYS) {
      this.availabilityFormArray.controls[idx].patchValue({
        timeFrom: '',
        timeTo: '',
      });
    }
  }
}
