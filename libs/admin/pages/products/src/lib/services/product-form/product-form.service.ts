import * as fp from 'lodash/fp';

import * as CrudApi from '@bgap/crud-gql/api';
import { Injectable } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { FormsService } from '@bgap/admin/shared/forms';
import { multiLangValidator } from '@bgap/admin/shared/utils';
import { EProductLevel } from '@bgap/shared/types';
import { cleanObject, customNumberCompare } from '@bgap/shared/utils';
import { pipe } from 'fp-ts/lib/function';

@Injectable({ providedIn: 'root' })
export class ProductFormService {
  constructor(
    private _formBuilder: FormBuilder,
    private _formsService: FormsService,
  ) {}

  public createProductFormGroup() {
    return this._formBuilder.group({
      name: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator },
      ),
      description: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator },
      ),
      productCategoryId: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      isVisible: ['', [Validators.required]],
      image: [''],
      variants: this._formBuilder.array([]),
      allergens: [[]],
      configSets: this._formBuilder.array([]),
    });
  }

  public createProductExtendFormGroup(productLevel: EProductLevel) {
    const dialogForm = this._formBuilder.group({
      isVisible: [''],
      variants: this._formBuilder.array([]),
      configSets: this._formBuilder.array([]),
    });

    if (productLevel === EProductLevel.GROUP) {
      dialogForm.addControl('tax', new FormControl('', Validators.required));
    }
    if (productLevel === EProductLevel.UNIT) {
      dialogForm.addControl('laneId', new FormControl(''));
      dialogForm.addControl(
        'takeaway',
        new FormControl(false, Validators.required),
      );
    }

    return dialogForm;
  }

  public patchProductVariants(product: Product, variants: FormArray): void {
    (product.variants || []).forEach((variant: ProductVariant): void => {
      const variantGroup = this._formsService.createProductVariantFormGroup();
      variantGroup.patchValue(cleanObject(variant));

      variants.push(variantGroup);
    });
  }

  public patchExtendedProductVariants(
    product: CrudApi.ChainProduct,
    variants: FormArray,
  ): void {
    pipe(
      [...(product.variants || [])],
      fp.filter<CrudApi.ProductVariant>(x => !!x),
      x => x.sort(customNumberCompare('position')),
      fp.forEach<CrudApi.ProductVariant>(variant => {
        const variantGroup = this._formsService.createProductVariantFormGroup();
        variantGroup.patchValue(cleanObject(variant));

        (variant?.availabilities || []).forEach(availability => {
          if (availability) {
            const availabilityGroup = this._formsService.createProductAvailabilityFormGroup();
            availabilityGroup.patchValue(cleanObject(availability));
            (variantGroup.controls.availabilities as FormArray).push(
              availabilityGroup,
            );
          }
        });

        variants.push(variantGroup);
      }),
    );
  }

  public patchConfigSet(
    product: CrudApi.ChainProduct,
    productLevel: EProductLevel,
    configSets: FormArray,
  ): void {
    (product.configSets || []).forEach(configSet => {
      const configSetGroup = this._formsService.createProductConfigSetFormGroup();
      configSetGroup.patchValue(cleanObject(fp.omit('items', configSet)));

      (configSet?.items || []).forEach(item => {
        if (item) {
          const configSetItemGroup = this._formsService.createProductConfigSetItemFormGroup(
            productLevel,
          );
          configSetItemGroup.patchValue(cleanObject(item));

          (configSetGroup.controls.items as FormArray).push(configSetItemGroup);
        }
      });

      configSets.push(configSetGroup);
    });
  }
}
