import { get as _get, set as _set } from 'lodash-es';
import { take } from 'rxjs/operators';
import { EImageType } from 'src/app/shared/enums';
import { IProductCategory } from 'src/app/shared/interfaces';
import { AbstractFormDialogComponent } from 'src/app/shared/modules/shared-forms/components/abstract-form-dialog/abstract-form-dialog.component';
import { multiLangValidator } from 'src/app/shared/pure';
import { EToasterType } from 'src/app/shared/services/toaster';
import { IState } from 'src/app/store';
import { currentUserSelectors } from 'src/app/store/selectors';

import { Component, Injector, OnInit } from '@angular/core';
import { select, Store } from '@ngrx/store';

@Component({
  selector: 'app-product-category-form',
  templateUrl: './product-category-form.component.html',
})
export class ProductCategoryFormComponent extends AbstractFormDialogComponent implements OnInit {
  public productCategory: IProductCategory;
  public eImageType = EImageType;
  private _store: Store<IState>;
  private _selectedChainId: string;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._store = this._injector.get(Store);
    this._store
      .pipe(select(currentUserSelectors.getSelectedChainId), take(1))
      .subscribe((selectedChainId: string): void => {
        this._selectedChainId = selectedChainId;
      });
  }

  get imagePath(): string {
    return _get(this.productCategory, 'image');
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      name: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator }
      ),
      description: this._formBuilder.group(
        {
          hu: [''],
          en: [''],
          de: [''],
        },
        { validators: multiLangValidator }
      ),
      image: [''],
    });

    if (this.productCategory) {
      this.dialogForm.patchValue(this.productCategory);
    }
  }

  public submit(): void {
    if (this.dialogForm.valid) {
      if (_get(this.productCategory, '_id')) {
        this._dataService
          .updateProductCategory(this._selectedChainId, this.productCategory._id, this.dialogForm.value)
          .then(
            (): void => {
              this._toasterService.show(EToasterType.SUCCESS, '', 'common.updateSuccessful');
              this.close();
            },
            (err): any => {
              console.error('CHAIN UPDATE ERROR', err);
            }
          );
      } else {
        this._dataService.insertProductCategory(this._selectedChainId, this.dialogForm.value).then(
          (): void => {
            this._toasterService.show(EToasterType.SUCCESS, '', 'common.insertSuccessful');
            this.close();
          },
          (err): any => {
            console.error('CHAIN INSERT ERROR', err);
          }
        );
      }
    }
  }

  public imageUploadCallback = (imagePath: string): void => {
    this.dialogForm.controls.image.setValue(imagePath);

    // Update existing user's image
    if (_get(this.productCategory, '_id')) {
      this._dataService
        .updateProductCategoryImagePath(this._selectedChainId, this.productCategory._id, imagePath)
        .then((): void => {
          this._toasterService.show(EToasterType.SUCCESS, '', 'common.imageUploadSuccess');
        });
    } else {
      this._toasterService.show(EToasterType.SUCCESS, '', 'common.imageUploadSuccess');
    }
  };

  public imageRemoveCallback = (): void => {
    this.dialogForm.controls.image.setValue('');

    if (this.productCategory) {
      _set(this.productCategory, 'image', null);
    }

    // Update existing user's image
    if (_get(this.productCategory, '_id')) {
      this._dataService
        .updateProductCategoryImagePath(this._selectedChainId, this.productCategory._id, null)
        .then((): void => {
          this._toasterService.show(EToasterType.SUCCESS, '', 'common.imageRemoveSuccess');
        });
    } else {
      this._toasterService.show(EToasterType.SUCCESS, '', 'common.imageRemoveSuccess');
    }
  };
}
