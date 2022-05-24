import { get, omit } from 'lodash/fp';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { AbstractFormDialogComponent } from '../../../../shared/forms';
import { loggedUserSelectors } from '../../../../store/logged-user';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  EImageType,
  EProductLevel,
  KeyValue,
  Product,
  UpsertResponse,
} from '@bgap/shared/types';
import { cleanObject, filterNullish } from '@bgap/shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';

import { PRODUCT_TYPES } from '../../const';
import { ProductFormService } from '../../services/product-form.service';

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

  private _userSettings: CrudApi.AdminUserSettings = {};

  constructor(
    protected _injector: Injector,
    private _productFormService: ProductFormService,
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
      .subscribe((userSettings: CrudApi.AdminUserSettings) => {
        this._userSettings = userSettings;
      });

    this.productCategories$ = this._productFormService.getProductCategories$();
  }

  get productImage(): string {
    return get('image', this.product) ?? '';
  }

  ngOnInit() {
    if (this.product) {
      this.dialogForm?.patchValue(
        omit(['variants', 'configSets'], cleanObject(this.product)),
      );

      this._productFormService.patchProductVariants(
        this.product.variants || [],
        this.dialogForm?.controls.variants as FormArray,
      );

      this._productFormService.patchConfigSet(
        this.product.configSets || [],
        this.dialogForm?.controls.configSets as FormArray,
      );
    } else {
      if (this._userSettings?.selectedProductCategoryId) {
        this.dialogForm?.controls.productCategoryId.patchValue(
          this._userSettings?.selectedProductCategoryId,
        );
      }
      this.dialogForm?.controls.isVisible.patchValue(true);
    }
  }

  public submit() {
    if (this.dialogForm?.valid) {
      this.setWorking$(true)
        .pipe(
          switchMap(() =>
            this._productFormService.saveChainForm$(
              {
                ...this.dialogForm?.value,
                chainId: this._userSettings?.selectedChainId || '',
                dirty: this.product?.dirty ? false : undefined,
              },
              this.product?.id || undefined,
            ),
          ),
          tap(() => this.setWorking$(false)),
        )
        .subscribe((response: UpsertResponse<unknown>) => {
          this._toasterService.showSimpleSuccess(response.type);

          this.close();
        });
    }
  }

  public imageUploadCallback = (image: string) => {
    this.dialogForm?.controls.image.setValue(image);
    this._changeDetectorRef.detectChanges();

    if (this.product?.id) {
      this._productFormService
        .updateImageStyles$(this.product?.id, image)
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('imageUpload');
        });
    } else {
      this._toasterService.showSimpleSuccess('imageUpload');
    }
  };

  public imageRemoveCallback = () => {
    this.dialogForm?.controls.image.setValue('');
    this._changeDetectorRef.detectChanges();

    if (this.product?.id) {
      this._productFormService
        .updateImageStyles$(this.product?.id, null)
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('imageRemove');
        });
    } else {
      this._toasterService.showSimpleSuccess('imageRemove');
    }
  };
}
