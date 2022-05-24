import { ChangeDetectorRef, Component, Input } from '@angular/core';
import { FormArray } from '@angular/forms';
import { WEEKLY_VARIANT_AVAILABILITY } from '../../../../shared/utils';
import { EVariantAvailabilityType, KeyValue } from '@bgap/shared/types';
import { TranslateService } from '@ngx-translate/core';

import { FormsService } from '../../services/forms/forms.service';

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-product-availabilities',
  templateUrl: './form-product-availabilities.component.html',
})
export class FormProductAvailabilitiesComponent {
  @Input() availabilityFormArray?: FormArray | null;
  @Input() currency?: string;
  public EVariantAvailabilityType = EVariantAvailabilityType;
  public iterativeAvailabilities: KeyValue[];
  public availabilityTypes;

  constructor(
    private _formsService: FormsService,
    private _translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.iterativeAvailabilities = Object.keys(WEEKLY_VARIANT_AVAILABILITY).map(
      (key): KeyValue => ({
        key,
        value: this._translateService.instant(
          WEEKLY_VARIANT_AVAILABILITY[
            <keyof typeof WEEKLY_VARIANT_AVAILABILITY>key
          ],
        ),
      }),
    );
    this.availabilityTypes = [
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
  }

  public addAvailability() {
    (<FormArray>this.availabilityFormArray)?.push(
      this._formsService.createProductAvailabilityFormGroup(),
    );

    this._changeDetectorRef.detectChanges();
  }

  public removeAvailability(idx: number) {
    (<FormArray>this.availabilityFormArray)?.removeAt(idx);

    this._changeDetectorRef.detectChanges();
  }

  public onTypeChange(value: EVariantAvailabilityType, idx: number) {
    // Clear days
    (<FormArray>this.availabilityFormArray)?.controls[idx].patchValue({
      dayFrom: '',
      dayTo: '',
    });

    if (value === EVariantAvailabilityType.ALWAYS) {
      (<FormArray>this.availabilityFormArray)?.controls[idx].patchValue({
        timeFrom: '',
        timeTo: '',
      });
    }

    this._changeDetectorRef.detectChanges();
  }
}
