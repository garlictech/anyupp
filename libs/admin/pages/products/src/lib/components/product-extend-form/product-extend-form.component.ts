import * as fp from 'lodash/fp';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import { ChangeDetectionStrategy, Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import {
  AbstractFormDialogComponent,
  FormsService,
} from '@bgap/admin/shared/forms';
import { EToasterType } from '@bgap/admin/shared/utils';
import {
  EProductLevel,
  IAdminUserSettings,
  IKeyValue,
  ILane,
  IProduct,
  IProductCategory,
  IProductVariant,
  IUnit,
} from '@bgap/shared/types';
import { customNumberCompare, objectToArray } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-extend-form',
  templateUrl: './product-extend-form.component.html',
})
export class ProductExtendFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public product!: IProduct;
  public productLevel!: EProductLevel;
  public eProductLevel = EProductLevel;
  public editing = false;
  public currency!: string;
  public productCategories$: Observable<IProductCategory[]>;
  public unitLanes: IKeyValue[] = [];

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private _store: Store<any>;
  private _formsService: FormsService;
  private _amplifyDataService: AmplifyDataService;
  private _logger: NGXLogger;
  private _selectedChainId?: string;
  private _selectedGroupId?: string;
  private _selectedUnitId?: string;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._formsService = this._injector.get(FormsService);
    this._amplifyDataService = this._injector.get(AmplifyDataService);
    this._logger = this._injector.get(NGXLogger);

    this._store = this._injector.get(Store);
    this._store
      .pipe(select(loggedUserSelectors.getLoggedUserSettings), take(1))
      .subscribe((userSettings: IAdminUserSettings | undefined): void => {
        this._selectedChainId = userSettings?.selectedChainId || '';
        this._selectedGroupId = userSettings?.selectedGroupId || '';
        this._selectedUnitId = userSettings?.selectedUnitId || '';
      });

    this.productCategories$ = this._store.pipe(
      select(productCategoriesSelectors.getAllProductCategories),
      untilDestroyed(this),
    );

    this._store
      .pipe(
        select(unitsSelectors.getSelectedUnit),
        skipWhile((unit: IUnit | undefined): boolean => !unit),
        take(1),
      )
      .subscribe((unit: IUnit | undefined): void => {
        this.unitLanes = (<ILane[]>objectToArray(unit?.lanes || {})).map(
          (lane): IKeyValue => ({
            key: lane.id || '',
            value: lane.name,
          }),
        );
      });
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      isVisible: [''],
      variants: this._formBuilder.array([]),
    });

    if (this.productLevel === EProductLevel.GROUP) {
      this.dialogForm.addControl(
        'tax',
        new FormControl('', Validators.required),
      );
    }
    if (this.productLevel === EProductLevel.UNIT) {
      this.dialogForm.addControl('laneId', new FormControl(''));
      this.dialogForm.addControl('takeaway', new FormControl(false, Validators.required));
    }

    if (this.product) {
      this.dialogForm.patchValue(fp.omit('variants', this.product));

      [...this.product.variants]
        .sort(customNumberCompare('position'))
        .forEach((variant: IProductVariant): void => {
          const variantGroup = this._formsService.createProductVariantFormGroup();
          variantGroup.patchValue(variant);

          (variant?.availabilities || []).forEach((availability): void => {
            const availabilityGroup = this._formsService.createProductAvailabilityFormGroup();
            availabilityGroup.patchValue(availability);
            (variantGroup.controls.availabilities as FormArray).push(
              availabilityGroup,
            );
          });

          (this.dialogForm?.controls.variants as FormArray).push(variantGroup);
        });
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

      if (this.editing) {
        try {
          await this._amplifyDataService.update<IProduct>(
            this.productLevel === EProductLevel.GROUP
              ? 'getGroupProduct'
              : 'getUnitProduct',
            this.productLevel === EProductLevel.GROUP
              ? 'updateGroupProduct'
              : 'updateUnitProduct',
            this.product.id,
            () => value,
          );

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
          await this._amplifyDataService.create(
            this.productLevel === EProductLevel.GROUP
              ? 'createGroupProduct'
              : 'createUnitProduct',
            value,
          );

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
