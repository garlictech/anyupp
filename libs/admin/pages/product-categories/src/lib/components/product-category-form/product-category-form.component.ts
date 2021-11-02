import { take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { multiLangValidator } from '@bgap/admin/shared/utils';
import { catchGqlError } from '@bgap/admin/shared/data-access/app-core';
import * as CrudApi from '@bgap/crud-gql/api';
import { EImageType } from '@bgap/shared/types';
import { select } from '@ngrx/store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-category-form',
  templateUrl: './product-category-form.component.html',
})
export class ProductCategoryFormComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public productCategory?: CrudApi.ProductCategory;
  public eImageType = EImageType;

  private _selectedChainId?: string | undefined | null;

  constructor(
    protected _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
    private _crudSdk: CrudSdkService,
  ) {
    super(_injector);

    this._store
      .pipe(select(loggedUserSelectors.getSelectedChainId), take(1))
      .subscribe((selectedChainId: string | undefined | null): void => {
        this._selectedChainId = selectedChainId;
      });
  }

  get categoryImage(): string {
    return this.productCategory?.image || '';
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
      image: [''],
    });

    if (this.productCategory) {
      this.dialogForm.patchValue(this.productCategory);
    }

    this._changeDetectorRef.detectChanges();
  }

  public submit() {
    if (this.dialogForm?.valid) {
      const value = {
        ...this.dialogForm?.value,
        chainId: this._selectedChainId,
        position: this.productCategory?.position || 0,
      };

      if (this.productCategory?.id) {
        this._crudSdk.sdk
          .UpdateProductCategory({
            input: {
              id: this.productCategory.id,
              ...value,
            },
          })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.showSimpleSuccess('common.updateSuccessful');

            this.close();
          });
      } else {
        this._crudSdk.sdk
          .CreateProductCategory({ input: value })
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

    if (this.productCategory?.id) {
      this.updateImageStyles(this.productCategory.id, image).subscribe(() => {
        this._toasterService.showSimpleSuccess('common.imageUploadSuccess');
      });
    } else {
      this._toasterService.showSimpleSuccess('common.imageUploadSuccess');
    }
  };

  public imageRemoveCallback = () => {
    this.dialogForm?.controls.image.setValue('');

    if (this.productCategory?.id) {
      this.updateImageStyles(this.productCategory.id, null).subscribe(() => {
        this._toasterService.showSimpleSuccess('common.imageUploadSuccess');
      });
    } else {
      this._toasterService.showSimpleSuccess('common.imageRemoveSuccess');
    }
  };

  private updateImageStyles(id: string, image: string | null) {
    return this._crudSdk.sdk
      .UpdateProductCategory({
        input: {
          id,
          image,
        },
      })
      .pipe(catchGqlError(this._store));
  }
}
