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
import { AdminUserSettings, Unit } from '@bgap/domain';
import {
  EImageType,
  KeyValue,
  Product,
  UpsertResponse,
} from '@bgap/shared/types';
import { cleanObject, filterNullish } from '@bgap/shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';

import { SERVING_MODES } from '../../../../shared/utils';
import { AbstractFormDialogComponent } from '../../../../shared/forms';
import { loggedUserSelectors } from '../../../../store/logged-user';
import { PRODUCT_TYPES } from '../../const';
import { ProductFormService } from '../../services/product-form.service';
import { unitsSelectors } from '../../../../store/units';
import assert from 'assert';

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
  public productCategories$: Observable<KeyValue[]>;
  public productTypes: KeyValue[] = PRODUCT_TYPES;
  public unitLanes$: Observable<KeyValue[]>;
  public currency!: string;
  public servingModes = SERVING_MODES;
  public selectedUnit?: Unit;

  private _userSettings: AdminUserSettings = {};

  constructor(
    protected override _injector: Injector,
    private _productFormService: ProductFormService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(_injector);

    this.dialogForm = this._productFormService.createProductFormGroup();

    this.unitLanes$ = this._store.pipe(
      select(unitsSelectors.getSelectedUnitLanes),
      filterNullish(),
      take(1),
    );

    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUserSettings),
        take(1),
        filterNullish(),
      )
      .subscribe((userSettings: AdminUserSettings) => {
        this._userSettings = userSettings;
      });

    this.productCategories$ = this._productFormService.getProductCategories$();

    this._store
      .pipe(select(unitsSelectors.getSelectedUnit), filterNullish(), take(1))
      .subscribe(unit => {
        this.selectedUnit = unit;
      });
  }

  get productImage(): string {
    return get('image', this.product) ?? '';
  }

  ngOnInit() {
    if (this.product) {
      this.dialogForm?.patchValue(
        omit(['variants', 'configSets'], cleanObject(this.product)),
      );

      this._productFormService.patchVariants(
        this.product.variants?.items || [],
        this.dialogForm?.controls['variants'] as FormArray,
      );

      this._productFormService.patchConfigSet(
        this.product.configSets || [],
        this.dialogForm?.controls['configSets'] as FormArray,
      );
    } else {
      if (this._userSettings?.selectedProductCategoryId) {
        this.dialogForm?.controls['productCategoryId'].patchValue(
          this._userSettings?.selectedProductCategoryId,
        );
      }
      this.dialogForm?.controls['isVisible'].patchValue(true);
    }
  }

  public submit() {
    assert(!!this.selectedUnit?.id);

    if (this.dialogForm?.valid) {
      this.setWorking$(true)
        .pipe(
          switchMap(() =>
            this._productFormService.saveUnitForm$(
              {
                ...this.dialogForm?.value,
                dirty: this.product?.dirty ? false : undefined,
                // Asserted...
                unitId: this.selectedUnit?.id ?? '',
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
    this.dialogForm?.controls['image'].setValue(image);
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
    this.dialogForm?.controls['image'].setValue('');
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
