import { get as _get, omit as _omit, set as _set } from 'lodash-es';
import { take } from 'rxjs/operators';
import { EImageType, EProductLevel, EProductType } from 'src/app/shared/enums';
import {
  IAdminUserSettings,
  IKeyValue,
  IProduct,
  IProductCategory,
  IProductVariant,
} from 'src/app/shared/interfaces';
import { AbstractFormDialogComponent } from 'src/app/shared/modules/shared-forms/components/abstract-form-dialog/abstract-form-dialog.component';
import {
  customNumberCompare,
  multiLangValidator,
  objectToArray,
} from 'src/app/shared/pure';
import { FormsService } from 'src/app/shared/services/forms';
import { EToasterType } from 'src/app/shared/services/toaster';
import { IState } from 'src/app/store';
import {
  currentUserSelectors,
  productCategoryListSelectors,
} from 'src/app/store/selectors';

import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'app-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public eImageType = EImageType;
  public product: IProduct;
  public productLevel: EProductLevel;
  public productCategories: IKeyValue[];
  public productTypes: IKeyValue[];
  private _store: Store<IState>;
  private _formsService: FormsService;
  private _selectedChainId: string;
  private _selectedGroupId: string;
  private _selectedProductCategoryId: string;

  constructor(protected _injector: Injector) {
    super(_injector);

    this.productTypes = [
      {
        key: EProductType.DRINK,
        value: 'products.productType.drink',
      },
      {
        key: EProductType.FOOD,
        value: 'products.productType.food',
      },
      {
        key: EProductType.OTHER,
        value: 'products.productType.other',
      },
    ];

    this._store = this._injector.get(Store);
    this._formsService = this._injector.get(FormsService);

    this._store
      .pipe(select(currentUserSelectors.getAdminUserSettings), take(1))
      .subscribe((userSettings: IAdminUserSettings): void => {
        this._selectedChainId = userSettings.selectedChainId;
        this._selectedGroupId = userSettings.selectedGroupId;
        this._selectedProductCategoryId =
          userSettings.selectedProductCategoryId;
      });

    this._store
      .pipe(
        select(productCategoryListSelectors.getAllProductCategories),
        untilDestroyed(this)
      )
      .subscribe((productCategories: IProductCategory[]): void => {
        this.productCategories = productCategories.map(
          (productCategory): IKeyValue => ({
            key: productCategory._id,
            value: productCategory.name,
          })
        );
      });
  }

  get imagePath(): string {
    return _get(this.product, 'image');
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      extends: [''],
      name: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator }
      ),
      description: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator }
      ),
      productCategoryId: ['', [Validators.required]],
      productType: ['', [Validators.required]],
      isVisible: [''],
      position: [''],
      image: [''],
      contains: this._formBuilder.group({
        allergens: this._formBuilder.group({
          lactose: [''],
          nuts: [''],
        }),
      }),
      ingredients: [''],
      _variantArr: this._formBuilder.array([]), // temp array!
    });

    if (this.product) {
      this.dialogForm.patchValue(_omit(this.product, 'variants'));

      // Parse variants object to temp array
      const variantsArr = objectToArray(
        this.product.variants || {},
        '_variantId'
      ).sort(customNumberCompare('position'));

      variantsArr.forEach((variant: IProductVariant): void => {
        const variantGroup = this._formsService.createProductVariantFormGroup(
          this.productLevel
        );
        variantGroup.patchValue(variant);

        (this.dialogForm.controls._variantArr as FormArray).push(variantGroup);
      });
    } else {
      // Patch ProductCategoryID
      if (this._selectedProductCategoryId) {
        this.dialogForm.controls.productCategoryId.patchValue(
          this._selectedProductCategoryId
        );
      }
      this.dialogForm.controls.isVisible.patchValue(true);
    }
  }

  public submit(): void {
    if (this.dialogForm.valid) {
      const value = {
        ...this.dialogForm.value,
        variants: {},
      };

      value._variantArr.map((variant): void => {
        value.variants[variant._variantId] = _omit(variant, '_variantId');
      });

      delete value._variantArr;

      if (_get(this.product, '_id')) {
        let updatePromise;

        switch (this.productLevel) {
          case EProductLevel.CHAIN:
            updatePromise = this._dataService.updateChainProduct(
              this._selectedChainId,
              this.product._id,
              value
            );
            break;
          default:
            break;
        }

        updatePromise.then(
          (): void => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.updateSuccessful'
            );
            this.close();
          },
          (err): any => {
            console.error('CHAIN UPDATE ERROR', err);
          }
        );
      } else {
        let insertPromise;

        switch (this.productLevel) {
          case EProductLevel.CHAIN:
            insertPromise = this._dataService.insertChainProduct(
              this._selectedChainId,
              value
            );
            break;
          default:
            break;
        }

        insertPromise.then(
          (): void => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.insertSuccessful'
            );
            this.close();
          },
          (err): any => {
            console.error('CHAIN INSERT ERROR', err);
          }
        );
      }
    }
  }

  public imageUploadCallback = (imagePath: string): void => {
    this.dialogForm.controls.image.setValue(imagePath);

    // Update existing user's image
    if (_get(this.product, '_id')) {
      this._dataService
        .updateProductCategoryImagePath(
          this._selectedGroupId,
          this.product._id,
          imagePath
        )
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageUploadSuccess'
          );
        });
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageUploadSuccess'
      );
    }
  };

  public imageRemoveCallback = (): void => {
    this.dialogForm.controls.image.setValue('');

    if (this.product) {
      _set(this.product, 'image', null);
    }

    // Update existing user's image
    if (_get(this.product, '_id')) {
      this._dataService
        .updateProductCategoryImagePath(
          this._selectedGroupId,
          this.product._id,
          null
        )
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageRemoveSuccess'
          );
        });
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageRemoveSuccess'
      );
    }
  };
}
