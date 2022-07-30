import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { iif, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import {
  UntypedFormArray,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import {
  CreateUnitProductInput,
  Maybe,
  ProductCategory,
  ProductConfigSet,
  ProductVariant,
  UpdateUnitProductInput,
} from '@bgap/domain';
import { KeyValue, UpsertResponse } from '@bgap/shared/types';
import { cleanObject, customNumberCompare } from '@bgap/shared/utils';
import { Store } from '@ngrx/store';

import { FormsService } from '../../../shared/forms';
import {
  multiLangValidator,
  notEmptyArray,
  optionalValueValidator,
} from '../../../shared/utils';
import { catchGqlError } from '../../../store/app-core';
import { ProductCategoryCollectionService } from '../../../store/product-categories';
import { UnitProductCollectionService } from '../../../store/products';

@Injectable({ providedIn: 'root' })
export class ProductFormService {
  constructor(
    private _formBuilder: UntypedFormBuilder,
    private _formsService: FormsService,
    private _store: Store,
    private _unitProductCollectionService: UnitProductCollectionService,
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
      this._formBuilder.control('', Validators.required),
    );
    dialogForm.addControl(
      'takeawayTax',
      this._formBuilder.control('', optionalValueValidator),
    );

    dialogForm.addControl('laneId', this._formBuilder.control(''));
    dialogForm.addControl(
      'supportedServingModes',
      this._formBuilder.control([], { validators: notEmptyArray }),
    );
    return dialogForm;
  }

  public patchProductVariants(
    productVariants: Maybe<ProductVariant>[],
    variantsArray: UntypedFormArray,
  ) {
    (productVariants || []).forEach(variant => {
      const variantGroup = this._formsService.createProductVariantFormGroup();

      if (!variant) {
        throw new Error('HANDLE ME: variant cannot be NULL');
      }
      variantGroup.patchValue(cleanObject(variant));

      variantsArray.push(variantGroup);
    });
  }

  public patchExtendedProductVariants(
    productVariants: Maybe<ProductVariant>[],
    variantsArray: UntypedFormArray,
  ) {
    pipe(
      [...(productVariants || [])],
      fp.filter<ProductVariant>(x => !!x),
      x => x.sort(customNumberCompare('position')),
      fp.forEach<ProductVariant>(variant => {
        const variantGroup = this._formsService.createProductVariantFormGroup();
        variantGroup.patchValue(cleanObject(variant));

        (variant?.availabilities || []).forEach(availability => {
          if (availability) {
            const availabilityGroup =
              this._formsService.createProductAvailabilityFormGroup();
            availabilityGroup.patchValue(cleanObject(availability));
            (variantGroup.controls['availabilities'] as UntypedFormArray).push(
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
    configSetsArray: UntypedFormArray,
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

          (configSetGroup.controls['items'] as UntypedFormArray).push(
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

  public saveUnitForm$(
    formValue: CreateUnitProductInput | UpdateUnitProductInput,
    unitId?: string,
  ) {
    return iif(
      () => !unitId,
      this.createUnitProduct$(<CreateUnitProductInput>formValue),
      this.updateUnitProduct$({
        ...formValue,
        // see 4 lines above
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        id: unitId!,
      }),
    );
  }

  public createUnitProduct$(
    input: CreateUnitProductInput,
  ): Observable<UpsertResponse<unknown>> {
    return this._unitProductCollectionService.add$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateUnitProduct$(
    input: UpdateUnitProductInput,
  ): Observable<UpsertResponse<unknown>> {
    return this._unitProductCollectionService.update$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }
}
