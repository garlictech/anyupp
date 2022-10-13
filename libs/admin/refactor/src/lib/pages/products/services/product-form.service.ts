import * as R from 'ramda';
import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { forkJoin, iif, Observable, of } from 'rxjs';
import { map, mapTo, switchMap, tap } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import {
  CreateUnitProductInput,
  Maybe,
  ProductCategory,
  ProductConfigSet,
  Variant,
  UpdateUnitProductInput,
  CreateVariantInput,
  UpdateVariantInput,
} from '@bgap/domain';
import { KeyValue, UpsertResponse } from '@bgap/shared/types';
import { cleanObject, customNumberCompare } from '@bgap/shared/utils';

import { FormsService } from '../../../shared/forms';
import {
  multiLangValidator,
  notEmptyArray,
  optionalValueValidator,
} from '../../../shared/utils';
import { ProductCategoryCollectionService } from '../../../store/product-categories';
import { UnitProductCollectionService } from '../../../store/products';
import { VariantCollectionService } from '../../../store/products/services/variant-collection.service';

@Injectable({ providedIn: 'root' })
export class ProductFormService {
  constructor(
    private _formBuilder: FormBuilder,
    private _formsService: FormsService,
    private _unitProductCollectionService: UnitProductCollectionService,
    private _variantCollectionService: VariantCollectionService,
    private _productCategoryCollectionService: ProductCategoryCollectionService,
  ) {}

  public getProductCategories$() {
    return this._productCategoryCollectionService.filteredEntities$.pipe(
      map((productCategories: ProductCategory[]) =>
        productCategories.map(
          (productCategory): KeyValue => ({
            key: productCategory.id,
            value: productCategory.name,
          }),
        ),
      ),
    );
  }

  public createProductFormGroup() {
    const dialogForm = this._formBuilder.group({
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

    dialogForm.addControl(
      'tax',
      this._formBuilder.control(null, Validators.required),
    );
    dialogForm.addControl(
      'takeawayTax',
      this._formBuilder.control(null, optionalValueValidator),
    );

    dialogForm.addControl('laneId', this._formBuilder.control(''));
    dialogForm.addControl(
      'supportedServingModes',
      this._formBuilder.control([], { validators: notEmptyArray }),
    );
    return dialogForm;
  }

  public patchVariants(
    productVariants: Maybe<Variant>[],
    variantsArray: FormArray,
  ) {
    pipe(
      [...(productVariants || [])],
      fp.filter<Variant>(x => !!x),
      x => x.sort(customNumberCompare('position')),
      fp.forEach<Variant>(variant => {
        const variantGroup = this._formsService.createProductVariantFormGroup();
        variantGroup.patchValue(cleanObject(variant));

        (variant?.availabilities || []).forEach(availability => {
          if (availability) {
            const availabilityGroup =
              this._formsService.createProductAvailabilityFormGroup();
            availabilityGroup.patchValue(cleanObject(availability));
            (variantGroup.controls['availabilities'] as FormArray).push(
              availabilityGroup,
            );
          }
        });

        variantsArray.push(variantGroup);
      }),
    );
  }

  public patchConfigSet(
    configSetValues: Maybe<ProductConfigSet>[],
    configSetsArray: FormArray,
  ) {
    (configSetValues || []).forEach(configSet => {
      const configSetGroup =
        this._formsService.createProductConfigSetFormGroup();
      configSetGroup.patchValue(cleanObject(fp.omit('items', configSet)));

      (configSet?.items || []).forEach(item => {
        if (item) {
          const configSetItemGroup =
            this._formsService.createProductConfigSetItemFormGroup();
          configSetItemGroup.patchValue(cleanObject(item));

          (configSetGroup.controls['items'] as FormArray).push(
            configSetItemGroup,
          );
        }
      });

      configSetsArray.push(configSetGroup);
    });
  }

  public updateImageStyles$(id: string, image: string | null) {
    return this.updateUnitProduct$({
      id,
      image,
    });
  }

  public saveUnitForm$(formValue: any, id?: string) {
    return iif(
      () => !id,
      this.createUnitProduct$({
        ...R.omit(['variants'], <CreateUnitProductInput>formValue),
        position: -1,
      }),
      this.updateUnitProduct$({
        ...R.omit(['variants'], formValue),
        // see 4 lines above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: id!,
      }),
    ).pipe(
      switchMap(product =>
        (R.isEmpty(formValue.variants)
          ? of([])
          : forkJoin(
              R.map(
                variant =>
                  variant?.id !== ''
                    ? this.updateVariant$(variant)
                    : this.createVariant$(variant, (product.data as any).id),
                formValue.variants,
              ),
            )
        ).pipe(
          tap(() =>
            this._unitProductCollectionService.removeOneFromCache(
              product.data as any,
            ),
          ),
          switchMap(() =>
            this._unitProductCollectionService.getByKey$(
              (product.data as any).id,
            ),
          ),
          mapTo(product),
        ),
      ),
    );
  }

  public createVariant$(
    input: CreateVariantInput,
    unitProductVariantsId: string,
  ): Observable<UpsertResponse<unknown>> {
    return this._variantCollectionService
      .add$({
        ...R.omit(['id'], input),
        unitProductVariantsId,
      })
      .pipe(map(data => ({ data, type: 'insert' })));
  }

  public updateVariant$(
    input: UpdateVariantInput,
  ): Observable<UpsertResponse<unknown>> {
    return this._variantCollectionService
      .update$(input)
      .pipe(map(data => ({ data, type: 'update' })));
  }
  public createUnitProduct$(
    input: CreateUnitProductInput,
  ): Observable<UpsertResponse<unknown>> {
    return this._unitProductCollectionService
      .add$(input)
      .pipe(map(data => ({ data, type: 'insert' })));
  }

  public updateUnitProduct$(
    input: UpdateUnitProductInput,
  ): Observable<UpsertResponse<unknown>> {
    return this._unitProductCollectionService
      .update$(input)
      .pipe(map(data => ({ data, type: 'update' })));
  }
}
