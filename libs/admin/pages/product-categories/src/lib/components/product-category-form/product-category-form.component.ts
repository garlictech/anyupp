import { NGXLogger } from 'ngx-logger';
import { take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { CrudSdkService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { EToasterType, multiLangValidator } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { EImageType } from '@bgap/shared/types';
import { select, Store } from '@ngrx/store';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-category-form',
  templateUrl: './product-category-form.component.html',
})
export class ProductCategoryFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public productCategory?: CrudApi.ProductCategory;
  public eImageType = EImageType;

  private _selectedChainId?: string | undefined | null;

  constructor(
    protected _injector: Injector,
    private _store: Store,
    private _logger: NGXLogger,
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

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      const value = {
        ...this.dialogForm?.value,
        chainId: this._selectedChainId,
        position: this.productCategory?.position || 0,
      };

      if (this.productCategory?.id) {
        try {
          await this._crudSdk.sdk
            .UpdateProductCategory({
              input: {
                id: this.productCategory.id,
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
          this._logger.error(`CHAIN UPDATE ERROR: ${JSON.stringify(error)}`);
        }
      } else {
        try {
          await this._crudSdk.sdk
            .CreateProductCategory({ input: value })
            .toPromise();

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.insertSuccessful',
          );
          this.close();
        } catch (error) {
          this._logger.error(`CHAIN INSERT ERROR: ${JSON.stringify(error)}`);
        }
      }
    }
  }

  public imageUploadCallback = async (image: string): Promise<void> => {
    this.dialogForm?.controls.image.setValue(image);

    if (this.productCategory?.id) {
      try {
        await this.updateImageStyles(this.productCategory.id, image);

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
  };

  public imageRemoveCallback = async (): Promise<void> => {
    this.dialogForm?.controls.image.setValue('');

    if (this.productCategory?.id) {
      try {
        await this.updateImageStyles(this.productCategory.id, null);

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
        'common.imageRemoveSuccess',
      );
    }
  };

  private async updateImageStyles(id: string, image: string | null) {
    await this._crudSdk.sdk
      .UpdateProductCategory({
        input: {
          id,
          image,
        },
      })
      .toPromise();
  }
}
