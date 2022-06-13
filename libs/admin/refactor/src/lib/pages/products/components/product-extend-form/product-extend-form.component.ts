import * as fp from 'lodash/fp';
import { iif, Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { AdminUserSettings, ProductCategory, ServingMode } from '@bgap/domain';
import {
  EProductLevel,
  KeyValue,
  Product,
  UpsertResponse,
} from '@bgap/shared/types';
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
  public productLevel!: EProductLevel;
  public eProductLevel = EProductLevel;
  public editing = false;
  public currency!: string;
  public productCategories$: Observable<ProductCategory[]>;
  public unitLanes$: Observable<KeyValue[]>;
  public servingModes = SERVING_MODES;
  public selectedUnit?: CrudApi.Unit;

  private _selectedChainId = '';
  private _selectedGroupId = '';
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
        this._selectedChainId = userSettings?.selectedChainId || '';
        this._selectedGroupId = userSettings?.selectedGroupId || '';
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
    this.dialogForm = this._productFormService.createProductExtendFormGroup(
      this.productLevel,
    );

    if (this.product) {
      this.dialogForm.patchValue(
        fp.omit(['variants', 'configSets'], cleanObject(this.product)),
      );

      this._productFormService.patchExtendedProductVariants(
        this.product.variants || [],
        this.dialogForm?.controls['variants'] as FormArray,
      );

      this._productFormService.patchConfigSet(
        this.product.configSets || [],
        this.dialogForm?.controls['configSets'] as FormArray,
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

      const parentInfo = {
        parentId: this.product?.id || '',
        chainId: this._selectedChainId,
        groupId: this._selectedGroupId,
      };

      this.setWorking$(true)
        .pipe(
          switchMap(() =>
            iif(
              () => this.productLevel === EProductLevel.UNIT,
              this._productFormService.saveUnitExtendForm$(
                {
                  ...this.dialogForm?.value,
                  ...parentInfo,
                  unitId: this._selectedUnitId,
                  position: 0,
                  takeaway,
                },
                {
                  ...this.dialogForm?.value,
                  id: this.product?.id || '',
                  dirty: this.product?.dirty ? false : undefined,
                  takeaway,
                },
                this.editing,
              ),
              this._productFormService.saveGroupExtendForm$(
                {
                  ...this.dialogForm?.value,
                  ...parentInfo,
                  takeawayTax: this.dialogForm?.value.takeawayTax || null, // save or remove
                },
                {
                  ...this.dialogForm?.value,
                  id: this.product?.id || '',
                  dirty: this.product?.dirty ? false : undefined, // save or leave
                  takeawayTax: this.dialogForm?.value.takeawayTax || null, // save or remove
                },
                this.editing,
              ),
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
