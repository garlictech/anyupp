import { switchMap, take, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { loggedUserSelectors } from '../../../../store/logged-user';
import { AbstractFormDialogComponent } from '../../../../shared/forms';
import * as CrudApi from '@bgap/crud-gql/api';
import { EImageType, UpsertResponse } from '@bgap/shared/types';
import { select } from '@ngrx/store';

import { ProductCategoryFormService } from '../../services/product-category-form.service';

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
    private _productCategoryFormService: ProductCategoryFormService,
  ) {
    super(_injector);

    this._store
      .pipe(select(loggedUserSelectors.getSelectedChainId), take(1))
      .subscribe((selectedChainId: string | undefined | null) => {
        this._selectedChainId = selectedChainId;
      });
  }

  get categoryImage(): string {
    return this.productCategory?.image || '';
  }

  ngOnInit() {
    this.dialogForm =
      this._productCategoryFormService.createProductCategoryFormGroup();

    if (this.productCategory) {
      this.dialogForm.patchValue(this.productCategory);
    }

    this._changeDetectorRef.detectChanges();
  }

  public submit() {
    if (this.dialogForm?.valid) {
      this.setWorking$(true)
        .pipe(
          switchMap(() =>
            this._productCategoryFormService.saveForm$(
              {
                ...this.dialogForm?.value,
                chainId: this._selectedChainId,
                position: this.productCategory?.position || 0,
              },
              this.productCategory?.id,
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

    if (this.productCategory?.id) {
      this._productCategoryFormService
        .updateImageStyles$(this.productCategory.id, image)
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('imageUpload');
        });
    } else {
      this._toasterService.showSimpleSuccess('imageUpload');
    }
  };

  public imageRemoveCallback = () => {
    this.dialogForm?.controls.image.setValue('');

    if (this.productCategory?.id) {
      this._productCategoryFormService
        .updateImageStyles$(this.productCategory.id, null)
        .subscribe(() => {
          this._toasterService.showSimpleSuccess('imageUpload');
        });
    } else {
      this._toasterService.showSimpleSuccess('imageRemove');
    }
  };
}
