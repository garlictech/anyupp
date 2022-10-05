import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormArray, FormControl } from '@angular/forms';
import {
  baseFromTaxedPrice,
  taxedFromBasePrice,
  WEEKLY_VARIANT_AVAILABILITY,
} from '../../../../shared/utils';
import { EVariantAvailabilityType, KeyValue } from '@bgap/shared/types';
import { TranslateService } from '@ngx-translate/core';
import { FormsService } from '../../services/forms/forms.service';
import { ServiceFeePolicy, ServiceFeeType } from '@bgap/domain';

@Component({
  // changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-product-availabilities',
  templateUrl: './form-product-availabilities.component.html',
  styleUrls: ['./form-product-availabilities.component.scss'],
})
export class FormProductAvailabilitiesComponent implements OnInit {
  @Input() availabilityFormArray?: FormArray | null;
  @Input() currency?: string;
  @Input() unitServiceFeePolicy?: ServiceFeePolicy | null;
  @Input() productTax?: number;
  public EVariantAvailabilityType = EVariantAvailabilityType;
  public iterativeAvailabilities: KeyValue[];
  public availabilityTypes;

  public netPriceFormArray: FormArray = new FormArray([]);
  public menuPriceFormArray: FormArray = new FormArray([]);

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

  ngOnInit() {
    // Create calculation fields
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    this.availabilityFormArray?.controls.forEach((availability, i) => {
      this.menuPriceFormArray.push(new FormControl(''));
      this.netPriceFormArray.push(new FormControl(''));
      this.grossPriceChanged(availability.value.price, i);
    });
  }

  public addAvailability() {
    (<FormArray>this.availabilityFormArray)?.push(
      this._formsService.createProductAvailabilityFormGroup(),
    );

    // Add calculation fields
    const newAvailabilityIdx = (this.availabilityFormArray?.length || 0) - 1;

    if (this.menuPriceFormArray.controls[newAvailabilityIdx]) {
      this.menuPriceFormArray.controls[newAvailabilityIdx].patchValue('');
    } else {
      this.menuPriceFormArray.controls[newAvailabilityIdx] = new FormControl(
        '',
      );
    }

    if (this.netPriceFormArray.controls[newAvailabilityIdx]) {
      this.netPriceFormArray.controls[newAvailabilityIdx].patchValue('');
    } else {
      this.netPriceFormArray.controls[newAvailabilityIdx] = new FormControl('');
    }

    this._changeDetectorRef.detectChanges();
  }

  public removeAvailability(idx: number) {
    (<FormArray>this.availabilityFormArray)?.removeAt(idx);

    // Remove calculation fields
    (<FormArray>this.menuPriceFormArray)?.removeAt(idx);
    (<FormArray>this.netPriceFormArray)?.removeAt(idx);

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

  public grossPriceChanged(value: number, idx: number) {
    this.menuPriceFormArray.controls[idx].patchValue(
      taxedFromBasePrice(
        +value,
        this.unitServiceFeePolicy?.type === ServiceFeeType.included
          ? +this.unitServiceFeePolicy.percentage
          : 0,
      ),
    );

    this.netPriceFormArray.controls[idx].patchValue(
      baseFromTaxedPrice(+value, this.productTax || 0),
    );
  }

  public menuPriceChanged(value: number, idx: number) {
    const grossPrice = baseFromTaxedPrice(
      +value,
      this.unitServiceFeePolicy?.type === ServiceFeeType.included
        ? +this.unitServiceFeePolicy.percentage
        : 0,
    );

    (this.availabilityFormArray as FormArray).controls[idx].patchValue({
      price: grossPrice,
    });

    this.netPriceFormArray.controls[idx].patchValue(
      baseFromTaxedPrice(grossPrice, this.productTax || 0),
    );
  }

  public netPriceChanged(value: number, idx: number) {
    const grossPrice = taxedFromBasePrice(+value, this.productTax || 0);

    (this.availabilityFormArray as FormArray).controls[idx].patchValue({
      price: grossPrice,
    });
    this.menuPriceFormArray.controls[idx].patchValue(
      taxedFromBasePrice(
        grossPrice,
        this.unitServiceFeePolicy?.type === ServiceFeeType.included
          ? +this.unitServiceFeePolicy.percentage
          : 0,
      ),
    );
  }
}
