import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { catchGqlError } from '@bgap/admin/shared/data-access/app-core';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  EImageType,
  EProductLevel,
  KeyValue,
  Product,
} from '@bgap/shared/types';
import { cleanObject, filterNullish } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';

import { PRODUCT_TYPES } from '../../const';
import { ProductFormService } from '../../services/product-form/product-form.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-form',
  templateUrl: './product-form.component.html',
})
export class ProductFormComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public eImageType = EImageType;
  public product?: Product;
  public productLevel!: EProductLevel;
  public productCategories$: Observable<KeyValue[]>;
  public productTypes: KeyValue[] = PRODUCT_TYPES;

  private _selectedChainId = '';
  private _selectedProductCategoryId = '';

  constructor(
    protected _injector: Injector,
    private _productFormService: ProductFormService,
    private _crudSdk: CrudSdkService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(_injector);

    this.dialogForm = this._productFormService.createProductFormGroup();

    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUserSettings),
        take(1),
        filterNullish(),
      )
      .subscribe((userSettings: CrudApi.AdminUserSettings): void => {
        this._selectedChainId = userSettings?.selectedChainId || '';
        this._selectedProductCategoryId =
          userSettings?.selectedProductCategoryId || '';
      });

    this.productCategories$ = this._store.pipe(
      select(productCategoriesSelectors.getAllProductCategories),
      map((productCategories: CrudApi.ProductCategory[]) =>
        productCategories.map(
          (productCategory): KeyValue => ({
            key: productCategory.id,
            value: productCategory.name,
          }),
        ),
      ),
      untilDestroyed(this),
    );
  }

  get productImage(): string {
    return fp.get('image', this.product) ?? '';
  }

  ngOnInit(): void {
    if (this.product) {
      this.dialogForm.patchValue(
        fp.omit(['variants', 'configSets'], cleanObject(this.product)),
      );

      this._productFormService.patchProductVariants(
        this.product,
        this.dialogForm?.controls.variants as FormArray,
      );

      this._productFormService.patchConfigSet(
        this.product,
        this.dialogForm?.controls.configSets as FormArray,
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

  public submit() {
    if (this.dialogForm?.valid) {
      const value = {
        ...this.dialogForm?.value,
        chainId: this._selectedChainId,
      };

      if (this.product?.id) {
        this._crudSdk.sdk
          .UpdateChainProduct({
            input: {
              ...value,
              id: this.product.id,
              dirty: this.product.dirty ? false : undefined,
            },
          })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.showSimpleSuccess('common.updateSuccessful');

            this.close();
          });
      } else {
        this._crudSdk.sdk
          .CreateChainProduct({ input: value })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.showSimpleSuccess('common.insertSuccessful');
            this.close();
          });
      }
    }
  }

  public imageUploadCallback = (image: string) => {
    this.dialogForm?.controls.image.setValue(image);

    // Update existing user's image
    if (this.product?.id) {
      this.updateImageStyles(this.product?.id, image).subscribe(() => {
        this._toasterService.showSimpleSuccess('common.imageUploadSuccess');
      });
    } else {
      this._toasterService.showSimpleSuccess('common.imageUploadSuccess');
    }

    this._changeDetectorRef.detectChanges();
  };

  public imageRemoveCallback = () => {
    this.dialogForm?.controls.image.setValue('');

    if (this.product?.id) {
      this.updateImageStyles(this.product?.id, null).subscribe(() => {
        this._toasterService.showSimpleSuccess('common.imageRemoveSuccess');
      });
    } else {
      this._toasterService.showSimpleSuccess('common.imageRemoveSuccess');
    }

    this._changeDetectorRef.detectChanges();
  };

  private updateImageStyles(id: string, image: string | null) {
    return this._crudSdk.sdk
      .UpdateChainProduct({
        input: {
          id,
          image,
        },
      })
      .pipe(catchGqlError(this._store));
  }
}
