import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { UntypedFormArray } from '@angular/forms';
import {
  AdminUserSettings,
  ProductCategory,
  ServingMode,
  Unit,
} from '@bgap/domain';
import { KeyValue, Product, UpsertResponse } from '@bgap/shared/types';
import { cleanObject, filterNullish } from '@bgap/shared/utils';
import { UntilDestroy } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';

import { AbstractFormDialogComponent } from '../../../../shared/forms';
import { SERVING_MODES } from '../../../../shared/utils';
import { loggedUserSelectors } from '../../../../store/logged-user';
import { ProductCategoryCollectionService } from '../../../../store/product-categories';
import { unitsSelectors } from '../../../../store/units';
import { ProductFormService } from '../../services/product-form.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-extend-form',
  templateUrl: './product-extend-form.component.html',
})
export class ProductExtendFormComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public product?: Product;
  public editing = false;
  public currency!: string;
  public productCategories$: Observable<ProductCategory[]>;
  public unitLanes$: Observable<KeyValue[]>;
  public servingModes = SERVING_MODES;
  public selectedUnit?: Unit;

  private _selectedUnitId = '';

  constructor(
    protected override _injector: Injector,
    private _productFormService: ProductFormService,
    private _productCategoryCollectionService: ProductCategoryCollectionService,
  ) {
    super(_injector);

    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUserSettings),
        take(1),
        filterNullish(),
      )
      .subscribe((userSettings: AdminUserSettings) => {
        this._selectedUnitId = userSettings?.selectedUnitId || '';
      });

    this.productCategories$ =
      this._productCategoryCollectionService.filteredEntities$;

    this.unitLanes$ = this._store.pipe(
      select(unitsSelectors.getSelectedUnitLanes),
      filterNullish(),
      take(1),
    );

    this._store
      .pipe(select(unitsSelectors.getSelectedUnit), filterNullish(), take(1))
      .subscribe(unit => {
        this.selectedUnit = unit;
      });
  }

  ngOnInit() {
    this.dialogForm = this._productFormService.createProductExtendFormGroup();

    if (this.product) {
      this.dialogForm.patchValue(
        fp.omit(['variants', 'configSets'], cleanObject(this.product)),
      );

      this._productFormService.patchExtendedProductVariants(
        this.product.variants || [],
        this.dialogForm?.controls['variants'] as UntypedFormArray,
      );

      this._productFormService.patchConfigSet(
        this.product.configSets || [],
        this.dialogForm?.controls['configSets'] as UntypedFormArray,
      );
    } else {
      this.dialogForm.controls['isVisible'].patchValue(true);
    }
  }

  public submit() {
    if (this.dialogForm?.valid) {
      const takeaway = (
        <string[]>this.dialogForm.value.supportedServingModes || []
      ).includes(ServingMode.takeaway);

      this.setWorking$(true)
        .pipe(
          switchMap(() =>
            this._productFormService.saveUnitForm$(
              {
                ...this.dialogForm?.value,
                id: this.product?.id,
                position: 0,
                dirty: this.product?.dirty,
                takeaway,
              },
              this._selectedUnitId,
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
}
