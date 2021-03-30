import * as fp from 'lodash/fp';
import { NGXLogger } from 'ngx-logger';
import { take } from 'rxjs/operators';

import { Component, Injector, OnInit } from '@angular/core';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { EToasterType, multiLangValidator } from '@bgap/admin/shared/utils';
import { EImageType, IProductCategory } from '@bgap/shared/types';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'bgap-product-category-form',
  templateUrl: './product-category-form.component.html',
})
export class ProductCategoryFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public productCategory!: IProductCategory;
  public eImageType = EImageType;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _store: Store<any>;
  private _selectedChainId?: string | undefined | null;
  private _amplifyDataService: AmplifyDataService;
  private _logger: NGXLogger;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._amplifyDataService = this._injector.get(AmplifyDataService);
    this._logger = this._injector.get(NGXLogger);

    this._store = this._injector.get(Store);
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
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      const value = {
        ...this.dialogForm?.value,
        chainId: this._selectedChainId,
        position: this.productCategory?.position || 0
      };

      if (this.productCategory?.id) {
        try {
          await this._amplifyDataService.update<IProductCategory>(
            'getProductCategory',
            'updateProductCategory',
            this.productCategory.id,
            () => value,
          );

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
          await this._amplifyDataService.create('createProductCategory', value);

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
        await this._amplifyDataService.update<IProductCategory>(
          'getProductCategory',
          'updateProductCategory',
          this.productCategory.id,
          (data: unknown) => fp.set(`image`, image, <IProductCategory>data),
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
  };

  public imageRemoveCallback = async (): Promise<void> => {
    this.dialogForm?.controls.image.setValue('');

    if (this.productCategory?.id) {
      try {
        await this._amplifyDataService.update<IProductCategory>(
          'getProductCategory',
          'updateProductCategory',
          this.productCategory.id,
          (data: unknown) => fp.set(`image`, null, <IProductCategory>data),
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
        'common.imageRemoveSuccess',
      );
    }
  };
}
