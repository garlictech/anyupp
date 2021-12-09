import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';

import { Injectable } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  Validators,
} from '@angular/forms';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { FormsService } from '@bgap/admin/shared/forms';
import { catchGqlError } from '@bgap/admin/shared/data-access/app-core';
import {
  multiLangValidator,
  notEmptyArray,
  optionalValueValidator,
} from '@bgap/admin/shared/utils';

import * as CrudApi from '@bgap/crud-gql/api';
import { EProductLevel, Product } from '@bgap/shared/types';
import { cleanObject, customNumberCompare } from '@bgap/shared/utils';
import { Store } from '@ngrx/store';
import { Maybe } from '@bgap/crud-gql/api';

@Injectable({ providedIn: 'root' })
export class ProductFormService {
  constructor(
    private _formBuilder: FormBuilder,
    private _formsService: FormsService,
    private _crudSdk: CrudSdkService,
    private _store: Store,
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
      dialogForm.addControl(
        'takeawayTax',
        new FormControl('', optionalValueValidator),
      );
    }
    if (productLevel === EProductLevel.UNIT) {
      dialogForm.addControl('laneId', new FormControl(''));
      dialogForm.addControl(
        'supportedServingModes',
        new FormControl([], { validators: notEmptyArray }),
      );
    }

    return dialogForm;
  }

  public patchProductVariants(product: Product, variants: FormArray): void {
    (product.variants || []).forEach(variant => {
      const variantGroup = this._formsService.createProductVariantFormGroup();

      if (!variant) {
        throw new Error('HANDLE ME: variant cannot be NULL');
      }
      variantGroup.patchValue(cleanObject(variant));

      variants.push(variantGroup);
    });
  }

  public patchExtendedProductVariants(
    productVariants: Maybe<CrudApi.ProductVariant>[],
    variants: FormArray,
  ): void {
    pipe(
      [...(productVariants || [])],
      fp.filter<CrudApi.ProductVariant>(x => !!x),
      x => x.sort(customNumberCompare('position')),
      fp.forEach<CrudApi.ProductVariant>(variant => {
        const variantGroup = this._formsService.createProductVariantFormGroup();
        variantGroup.patchValue(cleanObject(variant));

        (variant?.availabilities || []).forEach(availability => {
          if (availability) {
            const availabilityGroup =
              this._formsService.createProductAvailabilityFormGroup();
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

  public patchConfigSet(product: Product, configSets: FormArray): void {
    (product.configSets || []).forEach(configSet => {
      const configSetGroup =
        this._formsService.createProductConfigSetFormGroup();
      configSetGroup.patchValue(cleanObject(fp.omit('items', configSet)));

      (configSet?.items || []).forEach(item => {
        if (item) {
          const configSetItemGroup =
            this._formsService.createProductConfigSetItemFormGroup();
          configSetItemGroup.patchValue(cleanObject(item));

          (configSetGroup.controls.items as FormArray).push(configSetItemGroup);
        }
      });

      configSets.push(configSetGroup);
    });
  }

  public updateGroupProduct(input: CrudApi.UpdateGroupProductInput) {
    return this._crudSdk.sdk
      .UpdateGroupProduct({ input })
      .pipe(catchGqlError(this._store));
  }

  public updateUnitProduct(input: CrudApi.UpdateUnitProductInput) {
    return this._crudSdk.sdk
      .UpdateUnitProduct({ input })
      .pipe(catchGqlError(this._store));
  }

  public createGroupProduct(input: CrudApi.CreateGroupProductInput) {
    return this._crudSdk.sdk
      .CreateGroupProduct({ input })
      .pipe(catchGqlError(this._store));
  }

  public createUnitProduct(input: CrudApi.CreateUnitProductInput) {
    return this._crudSdk.sdk
      .CreateUnitProduct({ input })
      .pipe(catchGqlError(this._store));
  }
}
