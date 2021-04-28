import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { FormsService } from '../../services/forms/forms.service';
import { WEEKLY_VARIANT_AVAILABILITY } from '@bgap/admin/shared/utils';
import { EVariantAvailabilityType, IKeyValue } from '@bgap/shared/types';
import { TranslateService } from '@ngx-translate/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-product-availabilities',
  templateUrl: './form-product-availabilities.component.html',
})
export class FormProductAvailabilitiesComponent {
  @Input() availabilityFormArray!: FormArray;
  @Input() currency?: string;
  public EVariantAvailabilityType = EVariantAvailabilityType;
  public iterativeAvailabilities: IKeyValue[];

  constructor(
    private _formsService: FormsService,
    private _translateService: TranslateService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.iterativeAvailabilities = Object.keys(WEEKLY_VARIANT_AVAILABILITY).map(
      (key): IKeyValue => ({
        key,
        value: this._translateService.instant(
          WEEKLY_VARIANT_AVAILABILITY[
            <keyof typeof WEEKLY_VARIANT_AVAILABILITY>key
          ],
        ),
      }),
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
    (<FormArray>this.availabilityFormArray)?.push(
      this._formsService.createProductAvailabilityFormGroup(),
    );

    this._changeDetectorRef.detectChanges();
  }

  public removeAvailability(idx: number): void {
    (<FormArray>this.availabilityFormArray)?.removeAt(idx);

    this._changeDetectorRef.detectChanges();
  }

  public onTypeChange(value: EVariantAvailabilityType, idx: number): void {
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
