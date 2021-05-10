import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { FormsService } from '../../services/forms/forms.service';
import { customNumberCompare } from '@bgap/shared/utils';
import {
  EProductLevel,
  IAvailability,
  IProductVariant,
} from '@bgap/shared/types';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-product-variants',
  templateUrl: './form-product-variants.component.html',
})
export class FormProductVariantsComponent {
  @Input() variantFormArray!: FormArray;
  @Input() allowAddVariant: boolean;
  @Input() productLevel?: EProductLevel;
  @Input() currency?: string;

  public eProductLevel = EProductLevel;

  constructor(
    private _formsService: FormsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.allowAddVariant = true;
  }

  public addVariant(): void {
    (<FormArray>this.variantFormArray)?.push(
      this._formsService.createProductVariantFormGroup(),
    );

    this._changeDetectorRef.detectChanges();
  }

  public move(idx: number, change: number): void {
    const arr = this.variantFormArray?.value;
    const movingItem = arr[idx];

    if (
      (idx >= 0 && change === 1 && idx < arr.length - 1) ||
      (change === -1 && idx > 0)
    ) {
      arr.splice(idx, 1);
      arr.splice(idx + change, 0, movingItem);
      arr.forEach((variant: IProductVariant, pos: number): void => {
        variant.position = pos + 1;
      });

      arr.sort(customNumberCompare('position'));

      (<FormArray>this.variantFormArray)?.controls.forEach(
        (g: AbstractControl, i: number): void => {
          g.patchValue(arr[i]);
          (g.get('availabilities') as FormArray).clear();

          (arr[i]?.availabilities || []).forEach(
            (availability: IAvailability): void => {
              const availabilityGroup = this._formsService.createProductAvailabilityFormGroup();
              availabilityGroup.patchValue(availability);

              (g.get('availabilities') as FormArray).push(availabilityGroup);
            },
          );
        },
      );
    }

    this._changeDetectorRef.detectChanges();
  }
}
