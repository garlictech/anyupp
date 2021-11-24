import * as fp from 'lodash/fp';
import { Observable, of } from 'rxjs';
import { take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormArray } from '@angular/forms';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { SERVING_MODES } from '@bgap/admin/shared/utils';
import * as CrudApi from '@bgap/crud-gql/api';
import { EProductLevel, KeyValue, Product } from '@bgap/shared/types';
import { cleanObject, filterNullish } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';

import { ProductFormService } from '../../services/product-form/product-form.service';

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
  public productCategories$: Observable<CrudApi.ProductCategory[]>;
  public unitLanes: KeyValue[] = [];
  public servingModes = SERVING_MODES;

  private _selectedChainId = '';
  private _selectedGroupId = '';
  private _selectedUnitId = '';

  constructor(
    protected _injector: Injector,
    private _productFormService: ProductFormService,
  ) {
    super(_injector);

    this._store
      .pipe(
        select(loggedUserSelectors.getLoggedUserSettings),
        take(1),
        filterNullish(),
      )
      .subscribe((userSettings: CrudApi.AdminUserSettings): void => {
        this._selectedChainId = userSettings?.selectedChainId || '';
        this._selectedGroupId = userSettings?.selectedGroupId || '';
        this._selectedUnitId = userSettings?.selectedUnitId || '';
      });

    this.productCategories$ = this._store.pipe(
      select(productCategoriesSelectors.getAllProductCategories),
      untilDestroyed(this),
    );

    this._store
      .pipe(select(unitsSelectors.getSelectedUnit), filterNullish(), take(1))
      .subscribe((unit: CrudApi.Unit) => {
        this.unitLanes = unit.lanes
          ? unit.lanes.map(lane => ({
              key: lane?.id || '',
              value: lane?.name,
            }))
          : [];
      });
  }

  ngOnInit(): void {
    this.dialogForm = this._productFormService.createProductExtendFormGroup(
      this.productLevel,
    );

    if (this.product) {
      this.dialogForm.patchValue(
        fp.omit(['variants', 'configSets'], cleanObject(this.product)),
      );

      this._productFormService.patchExtendedProductVariants(
        this.product.variants || [],
        this.dialogForm?.controls.variants as FormArray,
      );

      this._productFormService.patchConfigSet(
        this.product,
        this.dialogForm?.controls.configSets as FormArray,
      );
    } else {
      this.dialogForm.controls.isVisible.patchValue(true);
    }
  }

  public submit() {
    this._save().subscribe(() => {
      this._successAndClose(this.editing ? 'update' : 'inert');
    });
  }

  private _save() {
    if (!this.product) {
      throw new Error('HANDLE ME: product cannot be undefined');
    }

    if (this.dialogForm?.valid) {
      if (this.editing) {
        const value = { ...this.dialogForm?.value };

        if (!value.takeawayTax) {
          delete value.takeawayTax;
        }

        // Handle deprecated field
        if (this.productLevel === EProductLevel.UNIT) {
          value.takeaway = (
            <string[]>value.supportedServingModes || []
          ).includes(CrudApi.ServingMode.takeaway);
        }

        const input = {
          ...value,
          id: this.product.id,
          dirty: this.product.dirty ? false : undefined,
        };

        if (this.productLevel === EProductLevel.GROUP) {
          return this._productFormService.updateGroupProduct(input);
        } else {
          return this._productFormService.updateUnitProduct(input);
        }
      } else {
        const value = {
          ...this.dialogForm?.value,
          parentId: this.product.id,
          chainId: this._selectedChainId,
          groupId: this._selectedGroupId,
        };

        if (!value.takeawayTax) {
          delete value.takeawayTax;
        }

        if (this.productLevel === EProductLevel.UNIT) {
          value.unitId = this._selectedUnitId;
          value.position = 0;

          // Handle deprecated field
          value.takeaway = (
            <string[]>value.supportedServingModes || []
          ).includes(CrudApi.ServingMode.takeaway);
        }

        const input = { ...value };

        if (this.productLevel === EProductLevel.GROUP) {
          return this._productFormService.createGroupProduct(input);
        } else {
          return this._productFormService.createUnitProduct(input);
        }
      }
    }

    return of('Invalid');
  }

  private _successAndClose(key: string) {
    this._toasterService.showSimpleSuccess(`common.${key}Successful`);
    this.close();
  }
}
