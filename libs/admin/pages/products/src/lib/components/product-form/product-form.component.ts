import * as fp from 'lodash/fp';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { map, switchMap, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { CrudSdkService } from '@bgap/admin/shared/data-access/data';
import * as CrudApi from '@bgap/crud-gql/api';
import { EToasterType } from '@bgap/admin/shared/utils';
import {
  EImageType,
  EProductLevel,
  IKeyValue,
  Product,
} from '@bgap/shared/types';
import { cleanObject, filterNullish } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

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
  implements OnInit {
  public eImageType = EImageType;
  public product?: Product;
  public productLevel!: EProductLevel;
  public productCategories$: Observable<IKeyValue[]>;
  public productTypes: IKeyValue[] = PRODUCT_TYPES;

  private _selectedChainId = '';
  private _selectedProductCategoryId = '';

  constructor(
    protected _injector: Injector,
    private _store: Store,
    private _productFormService: ProductFormService,
    private crudSdk: CrudSdkService,
    private _changeDetectorRef: ChangeDetectorRef,
    private _logger: NGXLogger,
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
        this.productLevel,
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

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      const value = {
        ...this.dialogForm?.value,
        chainId: this._selectedChainId,
      };

      if (this.product?.id) {
        try {
          await this.crudSdk.sdk
            .UpdateChainProduct({
              input: {
                id: this.product.id,
                ...value,
              },
            })
            .toPromise();

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
          await this.crudSdk.sdk
            .CreateChainProduct({ input: value })
            .toPromise();

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
        await this.updateImageStyles(image);

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
        await this.updateImageStyles(null);

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

  private async updateImageStyles(image: string | null) {
    await this.crudSdk.sdk
      .GetChainProduct({
        id:
          this.product?.id ||
          'FIXME THIS IS FROM UNHANDLED UNKNOWN VALUE IN updateImageStyles',
      })
      .pipe(
        filterNullish(),
        switchMap(data =>
          this.crudSdk.sdk.UpdateChainProduct({
            input: fp.set(`image`, image, data),
          }),
        ),
      )
      .toPromise();
  }
}
