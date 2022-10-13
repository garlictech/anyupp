import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
} from '@angular/core';
import { AbstractControl, FormArray } from '@angular/forms';
import { FormsService } from '../../services/forms/forms.service';
import { customNumberCompare } from '@bgap/shared/utils';
import { Availability, Variant, ServiceFeePolicy } from '@bgap/domain';
import { VariantCollectionService } from '../../../../store/products/services/variant-collection.service';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { CrudSdkService } from '../../../data-access/sdk';
import * as R from 'ramda';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-product-variants',
  templateUrl: './form-product-variants.component.html',
})
export class FormProductVariantsComponent {
  @Input() variantFormArray?: FormArray;
  @Input() allowAddVariant: boolean;
  @Input() currency?: string;
  @Input() unitServiceFeePolicy?: ServiceFeePolicy | null;
  @Input() productTax?: number;

  constructor(
    private _formsService: FormsService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _crudSdk: CrudSdkService,
  ) {
    this.allowAddVariant = true;
  }

  public addVariant() {
    (<FormArray>this.variantFormArray)?.push(
      this._formsService.createProductVariantFormGroup(),
    );

    this._changeDetectorRef.detectChanges();
  }

  public deleteVariant(i: number) {
    const variant = (<FormArray>this.variantFormArray).at(i).value;

    console.log('****FAVF', variant);
    if (!R.isEmpty(variant.id)) {
      this._crudSdk.sdk
        .DeleteVariant({ input: { id: variant.id } })
        .subscribe();
    }
    this.variantFormArray?.removeAt(i);
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
      arr.forEach((variant: Variant, pos: number) => {
        variant.position = pos + 1;
      });

      arr.sort(customNumberCompare('position'));

      (<FormArray>this.variantFormArray)?.controls.forEach(
        (g: AbstractControl, i: number) => {
          g.patchValue(arr[i]);
          (g.get('availabilities') as FormArray).clear();

          (arr[i]?.availabilities || []).forEach(
            (availability: Availability) => {
              const availabilityGroup =
                this._formsService.createProductAvailabilityFormGroup();
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
