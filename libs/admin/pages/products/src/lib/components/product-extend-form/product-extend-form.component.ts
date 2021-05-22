import * as fp from 'lodash/fp';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
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
import { EToasterType } from '@bgap/admin/shared/utils';
import { EProductLevel, IKeyValue, Product } from '@bgap/shared/types';
import { cleanObject, filterNullish } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import { CrudSdkService } from '@bgap/admin/shared/data-access/data';
import * as CrudApi from '@bgap/crud-gql/api';

import { ProductFormService } from '../../services/product-form/product-form.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-extend-form',
  templateUrl: './product-extend-form.component.html',
})
export class ProductExtendFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public product?: Product;
  public productLevel!: EProductLevel;
  public eProductLevel = EProductLevel;
  public editing = false;
  public currency!: string;
  public productCategories$: Observable<CrudApi.ProductCategory[]>;
  public unitLanes: IKeyValue[] = [];

  private _selectedChainId?: string;
  private _selectedGroupId?: string;
  private _selectedUnitId?: string;

  constructor(
    protected _injector: Injector,
    private crudSdk: CrudSdkService,
    private _store: Store,
    private _productFormService: ProductFormService,
    private _logger: NGXLogger,
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
      .subscribe(
        unit =>
          (this.unitLanes = unit.lanes
            ? unit.lanes.map(lane => ({
                key: lane?.id || '',
                value: lane?.name,
              }))
            : []),
      );
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
        this.product,
        this.dialogForm?.controls.variants as FormArray,
      );

      this._productFormService.patchConfigSet(
        this.product,
        this.productLevel,
        this.dialogForm?.controls.configSets as FormArray,
      );
    } else {
      this.dialogForm.controls.isVisible.patchValue(true);

      if (this.productLevel === EProductLevel.UNIT) {
        this.dialogForm.controls.takeaway.patchValue(false);
      }
    }
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      const value = { ...this.dialogForm?.value };

      if (!this.product) {
        throw new Error('HANDLE ME: product cannot be undefined');
      }

      if (this.editing) {
        try {
          const input = !{
            input: {
              id: this.product.id,
              ...value,
            },
          };

          if (!input) {
            throw new Error('HANDLE ME: input cannot be undefined');
          }

          if (this.productLevel === EProductLevel.GROUP) {
            await this.crudSdk.sdk.UpdateGroupProduct(input).toPromise();
          } else {
            await this.crudSdk.sdk.UpdateUnitProduct(input).toPromise();
          }

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.updateSuccessful',
          );
          this.close();
        } catch (error) {
          this._logger.error(
            `EXTENDED PRODUCT UPDATE ERROR: ${JSON.stringify(error)}`,
          );
        }
      } else {
        // Save the extended product id
        value.parentId = this.product.id;
        value.chainId = this._selectedChainId;
        value.groupId = this._selectedGroupId;
        if (this.productLevel === EProductLevel.UNIT) {
          value.unitId = this._selectedUnitId;
          value.position = 0;
        }

        try {
          const input = {
            input: value,
          };

          if (this.productLevel === EProductLevel.GROUP) {
            await this.crudSdk.sdk.CreateGroupProduct(input).toPromise();
          } else {
            await this.crudSdk.sdk.CreateUnitProduct(input).toPromise();
          }

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.insertSuccessful',
          );
          this.close();
        } catch (error) {
          this._logger.error(
            `EXTENDED PRODUCT INSERT ERROR: ${JSON.stringify(error)}`,
          );
        }
      }
    }
  }
}
