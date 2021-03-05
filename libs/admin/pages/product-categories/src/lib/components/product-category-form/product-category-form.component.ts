import * as fp from 'lodash/fp';
import { take } from 'rxjs/operators';

import { Component, Injector, OnInit } from '@angular/core';
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

  constructor(protected _injector: Injector) {
    super(_injector);

    this._store = this._injector.get(Store);
    this._store
      .pipe(select(loggedUserSelectors.getSelectedChainId), take(1))
      .subscribe((selectedChainId: string | undefined | null): void => {
        this._selectedChainId = selectedChainId;
      });
  }

  get imagePath(): string {
    return this.productCategory?.image;
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

  public submit(): void {
    if (this.dialogForm?.valid) {
      if (this.productCategory?.id) {
        this._dataService
          .updateProductCategory(
            this._selectedChainId || '',
            this.productCategory.id,
            this.dialogForm?.value,
          )
          .then(
            (): void => {
              this._toasterService.show(
                EToasterType.SUCCESS,
                '',
                'common.updateSuccessful',
              );
              this.close();
            },
            err => {
              console.error('CHAIN UPDATE ERROR', err);
            },
          );
      } else {
        this._dataService
          .insertProductCategory(
            this._selectedChainId || '',
            this.dialogForm?.value,
          )
          .then(
            (): void => {
              this._toasterService.show(
                EToasterType.SUCCESS,
                '',
                'common.insertSuccessful',
              );
              this.close();
            },
            err => {
              console.error('CHAIN INSERT ERROR', err);
            },
          );
      }
    }
  }

  public imageUploadCallback = (imagePath: string): void => {
    this.dialogForm?.controls.image.setValue(imagePath);

    // Update existing user's image
    if (this.productCategory?.id) {
      this._dataService
        .updateProductCategoryImagePath(
          this._selectedChainId || '',
          this.productCategory.id,
          imagePath,
        )
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageUploadSuccess',
          );
        });
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageUploadSuccess',
      );
    }
  };

  public imageRemoveCallback = (): void => {
    this.dialogForm?.controls.image.setValue('');

    if (this.productCategory) {
      fp.set('image', null, this.productCategory);
    }

    // Update existing user's image
    if (this.productCategory?.id) {
      this._dataService
        .updateProductCategoryImagePath(
          this._selectedChainId || '',
          this.productCategory.id,
          null,
        )
        .then((): void => {
          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.imageRemoveSuccess',
          );
        });
    } else {
      this._toasterService.show(
        EToasterType.SUCCESS,
        '',
        'common.imageRemoveSuccess',
      );
    }
  };
}
