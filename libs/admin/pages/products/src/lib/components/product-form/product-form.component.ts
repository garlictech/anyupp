import * as fp from 'lodash/fp';
import { NGXLogger } from 'ngx-logger';
import { take } from 'rxjs/operators';

import { ChangeDetectorRef, Component, Injector, OnInit } from '@angular/core';
import { FormArray, Validators } from '@angular/forms';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import {
  AbstractFormDialogComponent,
  FormsService,
} from '@bgap/admin/shared/forms';
import { EToasterType, multiLangValidator } from '@bgap/admin/shared/utils';
import {
  EImageType,
  EProductLevel,
  EProductType,
  IAdminUserSettings,
  IKeyValue,
  IProduct,
  IProductCategory,
  IProductVariant,
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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _store: Store<any>;
  private _formsService: FormsService;
  private _amplifyDataService: AmplifyDataService;
  private _changeDetectorRef: ChangeDetectorRef;
  private _logger: NGXLogger;
  private _selectedChainId = '';
  private _selectedGroupId = '';
  private _selectedProductCategoryId = '';

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
    this._amplifyDataService = this._injector.get(AmplifyDataService);
    this._logger = this._injector.get(NGXLogger);
    this._changeDetectorRef = this._injector.get(ChangeDetectorRef);

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUserSettings), take(1))
      .subscribe((userSettings: IAdminUserSettings | undefined): void => {
        this._selectedChainId = userSettings?.selectedChainId || '';
        this._selectedGroupId = userSettings?.selectedGroupId || '';
        this._selectedProductCategoryId =
          userSettings?.selectedProductCategoryId || '';
      });

    this._store
      .pipe(
        select(productCategoriesSelectors.getAllProductCategories),
        untilDestroyed(this),
      )
      .subscribe((productCategories: IProductCategory[]): void => {
        this.productCategories = productCategories.map(
          (productCategory): IKeyValue => ({
            key: productCategory.id,
            value: productCategory.name,
          }),
        );
      });
  }

  get productImage(): string {
    return this.product?.image || '';
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
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
      isVisible: [''],
      position: [''],
      image: [''],
      variants: this._formBuilder.array([]),
    });

    if (this.product) {
      this.dialogForm.patchValue(fp.omit('variants', this.product));

      this.product.variants.forEach((variant: IProductVariant): void => {
        const variantGroup = this._formsService.createProductVariantFormGroup();
        variantGroup.patchValue(variant);

        (this.dialogForm?.controls.variants as FormArray).push(variantGroup);
      });
    } else {
      // Patch ProductCategoryID
      if (this._selectedProductCategoryId) {
        this.dialogForm.controls.productCategoryId.patchValue(
          this._selectedProductCategoryId,
        );
      }
      this.dialogForm.controls.isVisible.patchValue(true);
    }
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      const value = {
        ...this.dialogForm?.value,
        chainId: this._selectedChainId,
      };

      if (this.product?.id) {
        try {
          await this._amplifyDataService.update<IProduct>(
            'getChainProduct',
            'updateChainProduct',
            this.product.id,
            () => value,
          );

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.updateSuccessful',
          );
          this.close();
        } catch (error) {
          this._logger.error(`UNIT UPDATE ERROR: ${JSON.stringify(error)}`);
        }
      } else {
        try {
          console.error('insert chain product', value);
          await this._amplifyDataService.create('createChainProduct', value);

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.insertSuccessful',
          );
          this.close();
        } catch (error) {
          this._logger.error(
            `CHAIN PRODUCT INSERT ERROR: ${JSON.stringify(error)}`,
          );
        }
      }
    }
  }

  public imageUploadCallback = async (image: string): Promise<void> => {
    this.dialogForm?.controls.image.setValue(image);

    // Update existing user's image
    if (this.product?.id) {
      try {
        await this._amplifyDataService.update<IProduct>(
          'getChainProduct',
          'updateChainProduct',
          this.product.id,
          (data: unknown) => fp.set(`image`, image, <IProduct>data),
        );

        this._toasterService.show(
          EToasterType.SUCCESS,
          '',
          'common.imageUploadSuccess',
        );
      } catch (error) {
        this._logger.error(
          `PRODUCT IMAGE UPLOAD ERROR: ${JSON.stringify(error)}`,
        );
      }
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageUploadSuccess',
      );
    }

    this._changeDetectorRef.detectChanges();
  };

  public imageRemoveCallback = async (): Promise<void> => {
    this.dialogForm?.controls.image.setValue('');

    if (this.product?.id) {
      try {
        await this._amplifyDataService.update<IProduct>(
          'getChainProduct',
          'updateChainProduct',
          this.product.id,
          (data: unknown) => fp.set(`image`, null, <IProduct>data),
        );

        this._toasterService.show(
          EToasterType.SUCCESS,
          '',
          'common.imageRemoveSuccess',
        );
      } catch (error) {
        this._logger.error(
          `PRODUCT IMAGE REMOVE ERROR: ${JSON.stringify(error)}`,
        );
      }
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageRemoveSuccess',
      );
    }

    this._changeDetectorRef.detectChanges();
  };
}
