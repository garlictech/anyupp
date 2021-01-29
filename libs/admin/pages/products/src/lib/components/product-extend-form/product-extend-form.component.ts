import { get as _get, omit as _omit } from 'lodash-es';
import { Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { loggedUserSelectors } from '@bgap/admin/shared/logged-user';
import { productCategoriesSelectors } from '@bgap/admin/shared/product-categories';
import { unitsSelectors } from '@bgap/admin/shared/units';
import { AbstractFormDialogComponent, FormsService } from '@bgap/admin/shared/forms';
import { customNumberCompare, EToasterType, objectToArray } from '@bgap/admin/shared/utils';
import {
  EProductLevel,
  IAdminUserSettings,
  IKeyValue,
  IProduct,
  IProductCategory,
  IProductVariant,
  IUnit,
} from '@bgap/shared/types';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  selector: 'bgap-product-extend-form',
  templateUrl: './product-extend-form.component.html',
})
export class ProductExtendFormComponent
  extends AbstractFormDialogComponent
  implements OnInit {
  public product: IProduct;
  public productLevel: EProductLevel;
  public eProductLevel = EProductLevel;
  public editing: boolean;
  public currency: string;
  public productCategories$: Observable<IProductCategory[]>;
  public unitLanes: IKeyValue[];

  private _store: Store<any>;
  private _formsService: FormsService;
  private _selectedChainId: string;
  private _selectedGroupId: string;
  private _selectedUnitId: string;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._formsService = this._injector.get(FormsService);

    this._store = this._injector.get(Store);
    this._store
      .pipe(select(loggedUserSelectors.getLoggedUserSettings), take(1))
      .subscribe((userSettings: IAdminUserSettings): void => {
        this._selectedChainId = userSettings.selectedChainId;
        this._selectedGroupId = userSettings.selectedGroupId;
        this._selectedUnitId = userSettings.selectedUnitId;
      });

    this.productCategories$ = this._store.pipe(
      select(productCategoriesSelectors.getAllProductCategories),
      untilDestroyed(this)
    );

    this._store
      .pipe(
        select(unitsSelectors.getSelectedUnit),
        skipWhile((unit: IUnit): boolean => !unit),
        take(1)
      )
      .subscribe((unit: IUnit): void => {
        this.unitLanes = objectToArray(unit.lanes).map(
          (lane): IKeyValue => ({
            key: lane._id,
            value: lane.name,
          })
        );
      });
  }

  get imagePath(): string {
    return _get(this.product, 'image');
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      isVisible: [''],
      _variantArr: this._formBuilder.array([]), // temp array!
    });

    if (this.productLevel === EProductLevel.GROUP) {
      this.dialogForm.addControl(
        'tax',
        new FormControl('', Validators.required)
      );
    }
    if (this.productLevel === EProductLevel.UNIT) {
      this.dialogForm.addControl('laneId', new FormControl(''));
      this.dialogForm.addControl('takeaway', new FormControl(''));
    }

    if (this.product) {
      this.dialogForm.patchValue(_omit(this.product, 'variants'));

      // Parse variants object to temp array
      const variantsArr = objectToArray(
        this.product.variants || {},
        '_variantId'
      ).sort(customNumberCompare('position'));

      variantsArr.forEach((variant: IProductVariant): void => {
        const variantGroup = this._formsService.createProductVariantFormGroup();
        variantGroup.patchValue(variant);

        _get(variant, 'availabilities', []).forEach((availability): void => {
          const availabilityGroup = this._formsService.createProductAvailabilityFormGroup();
          availabilityGroup.patchValue(availability);
          (variantGroup.controls.availabilities as FormArray).push(
            availabilityGroup
          );
        });

        (this.dialogForm.controls._variantArr as FormArray).push(variantGroup);
      });

      // Sort by "position"
      const arr: IProductVariant[] = this.dialogForm.controls._variantArr.value;
      arr.sort(customNumberCompare('position'));
      this.dialogForm.controls._variantArr.patchValue(arr);
    } else {
      this.dialogForm.controls.isVisible.patchValue(true);
    }
  }

  public submit(): void {
    if (this.dialogForm.valid) {
      const value = {
        ...this.dialogForm.value,
        variants: {},
      };

      value._variantArr.map((variant): void => {
        value.variants[variant._variantId] = _omit(variant, '_variantId');
      });

      delete value._variantArr;

      // Remove empty laneId
      if (value.laneId === '') {
        value.laneId = null;
      }

      if (this.editing) {
        let updatePromise;

        switch (this.productLevel) {
          case EProductLevel.GROUP:
            updatePromise = this._dataService.updateGroupProduct(
              this._selectedGroupId,
              this.product._id,
              value
            );
            break;
          case EProductLevel.UNIT:
            updatePromise = this._dataService.updateUnitProduct(
              this._selectedUnitId,
              this.product._id,
              value
            );
            break;
          default:
            break;
        }

        updatePromise.then(
          (): void => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.updateSuccessful'
            );
            this.close();
          },
          err => {
            console.error('CHAIN UPDATE ERROR', err);
          }
        );
      } else {
        let insertPromise;

        // Set extends path on insert
        value.extends = this._generateExtendsPath();

        switch (this.productLevel) {
          case EProductLevel.GROUP:
            insertPromise = this._dataService.insertGroupProduct(
              this._selectedGroupId,
              value
            );
            break;
          case EProductLevel.UNIT:
            insertPromise = this._dataService.insertUnitProduct(
              this._selectedUnitId,
              value
            );
            break;
          default:
            break;
        }

        insertPromise.then(
          (): void => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.insertSuccessful'
            );
            this.close();
          },
          err => {
            console.error('CHAIN INSERT ERROR', err);
          }
        );
      }
    }
  }

  private _generateExtendsPath(): string {
    switch (this.productLevel) {
      case EProductLevel.GROUP:
        return `products/chains/${this._selectedChainId}/${this.product._id}`;
      case EProductLevel.UNIT:
        return `products/groups/${this._selectedGroupId}/${this.product._id}`;
      default:
        break;
    }
  }
}
