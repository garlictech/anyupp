import * as fp from 'lodash/fp';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
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
  IProductConfigComponent,
  IProductConfigSet,
  IProductVariant,
} from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public eImageType = EImageType;
  public product!: IProduct;
  public productLevel!: EProductLevel;
  public productCategories$: Observable<IKeyValue[]>;
  public productTypes: IKeyValue[];

  private _selectedChainId = '';
  private _selectedGroupId = '';
  private _selectedProductCategoryId = '';

  constructor(
    protected _injector: Injector,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _formsService: FormsService,
    private _amplifyDataService: AmplifyDataService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _logger: NGXLogger,
  ) {
    super(_injector);

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
      isVisible: ['', [Validators.required]],
      image: [''],
      variants: this._formBuilder.array([]),
      allergens: [[]],
      configSets: this._formBuilder.array([]),
    });

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

    this._store
      .pipe(select(loggedUserSelectors.getLoggedUserSettings), take(1))
      .subscribe((userSettings: IAdminUserSettings | undefined): void => {
        this._selectedChainId = userSettings?.selectedChainId || '';
        this._selectedGroupId = userSettings?.selectedGroupId || '';
        this._selectedProductCategoryId =
          userSettings?.selectedProductCategoryId || '';
      });

    this.productCategories$ = this._store.pipe(
      select(productCategoriesSelectors.getAllProductCategories),
      map((productCategories: IProductCategory[]) =>
        productCategories.map(
          (productCategory): IKeyValue => ({
            key: productCategory.id,
            value: productCategory.name,
          }),
        ),
      ),
      untilDestroyed(this),
    );
  }

  get productImage(): string {
    return this.product?.image || '';
  }

  ngOnInit(): void {
    if (this.product) {
      this.dialogForm.patchValue(
        fp.omit(['variants', 'configSets'], cleanObject(this.product)),
      );

      // Patch variants
      (this.product.variants || []).forEach(
        (variant: IProductVariant): void => {
          const variantGroup = this._formsService.createProductVariantFormGroup();
          variantGroup.patchValue(cleanObject(variant));

          (this.dialogForm?.controls.variants as FormArray).push(variantGroup);
        },
      );

      // Patch configSets
      (this.product.configSets || []).forEach(
        (configSet: IProductConfigSet): void => {
          const configSetGroup = this._formsService.createProductConfigSetFormGroup();
          configSetGroup.patchValue(cleanObject(fp.omit('items', configSet)));

          (configSet.items || []).forEach((item: IProductConfigComponent) => {
            const configSetItemGroup = this._formsService.createProductConfigSetItemFormGroup(
              this.productLevel,
            );
            configSetItemGroup.patchValue(cleanObject(item));

            (configSetGroup.controls.items as FormArray).push(
              configSetItemGroup,
            );
          });

          (this.dialogForm?.controls.configSets as FormArray).push(
            configSetGroup,
          );
        },
      );
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
          this._logger.error(
            `CHAIN PRODUCT UPDATE ERROR: ${JSON.stringify(error)}`,
          );
        }
      } else {
        try {
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
