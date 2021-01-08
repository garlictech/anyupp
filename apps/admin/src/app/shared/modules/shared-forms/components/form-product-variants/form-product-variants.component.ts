import { get as _get } from 'lodash-es';
import { EProductLevel } from '../../../../enums';
import { IProductVariant } from '../../../../interfaces';
import { customNumberCompare } from '../../../../pure';
import { FormsService } from '../../../../services/forms';

import { Component, Input } from '@angular/core';
import { FormArray, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-form-product-variants',
  templateUrl: './form-product-variants.component.html',
})
export class FormProductVariantsComponent {
  @Input() variantFormArray: FormArray;
  @Input() allowAddVariant: boolean;
  @Input() productLevel: EProductLevel;
  @Input() currency?: string;

  public EProductLevel = EProductLevel;

  constructor(private _formsService: FormsService) {
    this.allowAddVariant = true;
  }

  public addVariant(): void {
    this.variantFormArray.push(
      this._formsService.createProductVariantFormGroup(this.productLevel)
    );
  }

  public move(idx: number, change: number): void {
    const arr = this.variantFormArray.value;
    const movingItem = arr[idx];

    if (
      (idx >= 0 && change === 1 && idx < arr.length - 1) ||
      (change === -1 && idx > 0)
    ) {
      arr.splice(idx, 1);
      arr.splice(idx + change, 0, movingItem);
      arr.forEach((variant: IProductVariant, pos: number): void => {
        variant.position = (pos + 1).toString();
      });

      arr.sort(customNumberCompare('position'));

      this.variantFormArray.controls.forEach(
        (g: FormGroup, i: number): void => {
          g.patchValue(arr[i]);
          (g.controls.availabilities as FormArray).clear();

          _get(arr[i], 'availabilities', []).forEach((availability): void => {
            const availabilityGroup = this._formsService.createProductAvailabilityFormGroup();
            availabilityGroup.patchValue(availability);

            (g.controls.availabilities as FormArray).push(availabilityGroup);
          });
        }
      );
    }
  }
}
