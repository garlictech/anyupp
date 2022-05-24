import { pipe } from 'fp-ts/lib/function';
import * as fp from 'lodash/fp';
import { iif, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Injectable } from '@angular/core';
import { FormArray, FormBuilder, Validators } from '@angular/forms';
import { FormsService } from '../../../shared/forms';
import {
  multiLangValidator,
  notEmptyArray,
  optionalValueValidator,
} from '../../../shared/utils';
import { catchGqlError } from '../../../store/app-core';
import { ProductCategoryCollectionService } from '../../../store/product-categories';
import {
  ChainProductCollectionService,
  GroupProductCollectionService,
  UnitProductCollectionService,
} from '../../../store/products';
import * as CrudApi from '@bgap/crud-gql/api';
import { EProductLevel, KeyValue, UpsertResponse } from '@bgap/shared/types';
import { cleanObject, customNumberCompare } from '@bgap/shared/utils';
import { Store } from '@ngrx/store';

import { handleEmptyPackaginFees } from '../fn';

@Injectable({ providedIn: 'root' })
export class ProductFormService {
  constructor(
    private _formBuilder: FormBuilder,
    private _formsService: FormsService,
    private _store: Store,
    private _unitProductCollectionService: UnitProductCollectionService,
    private _groupProductCollectionService: GroupProductCollectionService,
    private _chainProductCollectionService: ChainProductCollectionService,
    private _productCategoryCollectionService: ProductCategoryCollectionService,
  ) {}

  public getProductCategories$() {
    return this._productCategoryCollectionService.filteredEntities$.pipe(
      map((productCategories: CrudApi.ProductCategory[]) =>
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
      dialogForm.addControl(
        'tax',
        this._formBuilder.control('', Validators.required),
      );
      dialogForm.addControl(
        'takeawayTax',
        this._formBuilder.control('', optionalValueValidator),
      );
    }

    if (productLevel === EProductLevel.UNIT) {
      dialogForm.addControl('laneId', this._formBuilder.control(''));
      dialogForm.addControl(
        'supportedServingModes',
        this._formBuilder.control([], { validators: notEmptyArray }),
      );
    }

    return dialogForm;
  }

  public patchProductVariants(
    productVariants: CrudApi.Maybe<CrudApi.ProductVariant>[],
    variantsArray: FormArray,
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
    productVariants: CrudApi.Maybe<CrudApi.ProductVariant>[],
    variantsArray: FormArray,
  ) {
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

        variantsArray.push(variantGroup);
      }),
    );
  }

  public patchConfigSet(
    configSetValues: CrudApi.Maybe<CrudApi.ProductConfigSet>[],
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

          (configSetGroup.controls.items as FormArray).push(configSetItemGroup);
        }
      });

      configSetsArray.push(configSetGroup);
    });
  }

  public updateImageStyles$(id: string, image: string | null) {
    return this.updateChainProduct$({
      id,
      image,
    });
  }

  //
  // CHAIN PRODUCT
  //

  public saveChainForm$(
    formValue:
      | CrudApi.CreateChainProductInput
      | CrudApi.UpdateChainProductInput,
    chainId?: string,
  ) {
    return iif(
      () => !chainId,
      this.createChainProduct$(<CrudApi.CreateChainProductInput>formValue),
      this.updateChainProduct$({
        ...formValue,
        id: chainId || '',
      }),
    );
  }

  public createChainProduct$(input: CrudApi.CreateChainProductInput) {
    return this._chainProductCollectionService.add$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateChainProduct$(input: CrudApi.UpdateChainProductInput) {
    return this._chainProductCollectionService.update$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }

  //
  // GROUP PRODUCT
  //

  public saveGroupExtendForm$(
    createFormValue: CrudApi.CreateGroupProductInput,
    updateFormValue: CrudApi.UpdateGroupProductInput,
    isEditing: boolean,
  ) {
    return iif(
      () => !isEditing,
      this.createGroupProduct$(createFormValue),
      this.updateGroupProduct$(updateFormValue),
    );
  }

  public createGroupProduct$(input: CrudApi.CreateGroupProductInput) {
    return this._groupProductCollectionService.add$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateGroupProduct$(input: CrudApi.UpdateGroupProductInput) {
    return this._groupProductCollectionService.update$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }

  //
  // UNIT PRODUCT
  //

  public saveUnitExtendForm$(
    createFormValue: CrudApi.CreateUnitProductInput,
    updateFormValue: CrudApi.UpdateUnitProductInput,
    isEditing: boolean,
  ) {
    return iif(
      () => !isEditing,
      this.createUnitProduct$(
        <CrudApi.CreateUnitProductInput>(
          handleEmptyPackaginFees(createFormValue)
        ),
      ),
      this.updateUnitProduct$(
        <CrudApi.UpdateUnitProductInput>(
          handleEmptyPackaginFees(updateFormValue)
        ),
      ),
    );
  }

  public createUnitProduct$(
    input: CrudApi.CreateUnitProductInput,
  ): Observable<UpsertResponse<unknown>> {
    return this._unitProductCollectionService.add$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'insert' })),
    );
  }

  public updateUnitProduct$(
    input: CrudApi.UpdateUnitProductInput,
  ): Observable<UpsertResponse<unknown>> {
    return this._unitProductCollectionService.update$(input).pipe(
      catchGqlError(this._store),
      map(data => ({ data, type: 'update' })),
    );
  }
}
