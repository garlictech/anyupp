import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { AbstractControl, UntypedFormArray } from '@angular/forms';
import { FormsService } from '../../services/forms/forms.service';
import { customNumberCompare } from '@bgap/shared/utils';
import { EProductLevel } from '@bgap/shared/types';
import { Availability, ProductVariant, ServiceFeePolicy } from '@bgap/domain';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-product-variants',
  templateUrl: './form-product-variants.component.html',
})
export class FormProductVariantsComponent {
  @Input() variantFormArray?: UntypedFormArray;
  @Input() allowAddVariant: boolean;
  @Input() productLevel?: EProductLevel;
  @Input() currency?: string;
  @Input() unitServiceFeePolicy?: ServiceFeePolicy | null;
  @Input() productTax?: number;

  public eProductLevel = EProductLevel;

  constructor(
    private _formsService: FormsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.allowAddVariant = true;
  }

  public addVariant() {
    (<UntypedFormArray>this.variantFormArray)?.push(
      this._formsService.createProductVariantFormGroup(),
    );

    this._changeDetectorRef.detectChanges();
  }

  public move(idx: number, change: number) {
    const arr = this.variantFormArray?.value;
    const movingItem = arr[idx];

    if (
      (idx >= 0 && change === 1 && idx < arr.length - 1) ||
      (change === -1 && idx > 0)
    ) {
      arr.splice(idx, 1);
      arr.splice(idx + change, 0, movingItem);
      arr.forEach((variant: ProductVariant, pos: number) => {
        variant.position = pos + 1;
      });

      arr.sort(customNumberCompare('position'));

      (<UntypedFormArray>this.variantFormArray)?.controls.forEach(
        (g: AbstractControl, i: number) => {
          g.patchValue(arr[i]);
          (g.get('availabilities') as UntypedFormArray).clear();

          (arr[i]?.availabilities || []).forEach(
            (availability: Availability) => {
              const availabilityGroup =
                this._formsService.createProductAvailabilityFormGroup();
              availabilityGroup.patchValue(availability);

              (g.get('availabilities') as UntypedFormArray).push(
                availabilityGroup,
              );
            },
          );
        },
      );
    }

    this._changeDetectorRef.detectChanges();
  }
}
