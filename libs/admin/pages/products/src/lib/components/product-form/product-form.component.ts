import { get as _get, omit as _omit, set as _set } from 'lodash-es';
import { take } from 'rxjs/operators';

import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { AbstractFormDialogComponent, FormsService } from '@bgap/admin/shared/forms';
import { customNumberCompare, EToasterType, multiLangValidator, objectToArray } from '@bgap/admin/shared/utils';
import {
  EImageType, EProductLevel, EProductType, IAdminUserSettings, IKeyValue, IProduct, IProductCategory, IProductVariant
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public eImageType = EImageType;
  public product!: IProduct;
  public productLevel!: EProductLevel;
  public productCategories: IKeyValue[] = [];
  public productTypes: IKeyValue[];
  private _store: Store<any>;
  private _formsService: FormsService;
  private _selectedChainId: string = '';
  private _selectedGroupId: string = '';
  private _selectedProductCategoryId: string = '';

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
      .pipe(select(loggedUserSelectors.getLoggedUserSettings), take(1))
      .subscribe((userSettings: IAdminUserSettings | undefined): void => {
        this._selectedChainId = userSettings?.selectedChainId || '';
        this._selectedGroupId = userSettings?.selectedGroupId || '';
        this._selectedProductCategoryId =
          userSettings?.selectedProductCategoryId || '';
      });

    this._store
      .pipe(
        select(productCategoriesSelectors.getAllProductCategories),
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
        const variantGroup = this._formsService.createProductVariantFormGroup();
        variantGroup.patchValue(variant);

        (this.dialogForm?.controls._variantArr as FormArray).push(variantGroup);
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
    if (this.dialogForm?.valid) {
      const value = {
        ...this.dialogForm?.value,
        variants: {},
      };

      value._variantArr.map((variant: IProductVariant): void => {
        value.variants[variant._variantId!] = _omit(variant, '_variantId');
      });

      delete value._variantArr;

      if (_get(this.product, '_id')) {
        let updatePromise: Promise<void> = new Promise(() => {});

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
          err => {
            console.error('CHAIN UPDATE ERROR', err);
          }
        );
      } else {
        let insertPromise: Promise<unknown> = new Promise(() => {});

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
          err => {
            console.error('CHAIN INSERT ERROR', err);
          }
        );
      }
    }
  }

  public imageUploadCallback = (imagePath: string): void => {
    this.dialogForm?.controls.image.setValue(imagePath);

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
    this.dialogForm?.controls.image.setValue('');

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
