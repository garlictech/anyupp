import * as fp from 'lodash/fp';
import { Observable } from 'rxjs';
import { skipWhile, take } from 'rxjs/operators';

import { Component, Injector, OnInit } from '@angular/core';
import { FormArray, FormControl, Validators } from '@angular/forms';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productCategoriesSelectors } from '@bgap/admin/shared/data-access/product-categories';
import { unitsSelectors } from '@bgap/admin/shared/data-access/units';
import { AbstractFormDialogComponent, FormsService } from '@bgap/admin/shared/forms';
import { EToasterType } from '@bgap/admin/shared/utils';
import {
  EProductLevel, IAdminUserSettings, IKeyValue, ILane, IProduct, IProductCategory, IProductVariant, IUnit
} from '@bgap/shared/types';
import { customNumberCompare, objectToArray } from '@bgap/shared/utils';
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
  private _selectedChainId?: string;
  private _selectedGroupId?: string;
  private _selectedUnitId?: string;

  constructor(protected _injector: Injector) {
    super(_injector);

    this._formsService = this._injector.get(FormsService);

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

  get imagePath(): string {
    return this.product?.image;
  }

  ngOnInit(): void {
    this.dialogForm = this._formBuilder.group({
      isVisible: [''],
      _variantArr: this._formBuilder.array([]), // temp array!
    });

    if (this.productLevel === EProductLevel.GROUP) {
      this.dialogForm.addControl(
        'tax',
        new FormControl('', Validators.required),
      );
    }
    if (this.productLevel === EProductLevel.UNIT) {
      this.dialogForm.addControl('laneId', new FormControl(''));
      this.dialogForm.addControl('takeaway', new FormControl(''));
    }

    if (this.product) {
      this.dialogForm.patchValue(fp.omit('variants', this.product));

      // Parse variants object to temp array
      const variantsArr = (<IProductVariant[]>(
        objectToArray(this.product.variants || {})
      )).sort(customNumberCompare('position'));

      variantsArr.forEach((variant: IProductVariant): void => {
        const variantGroup = this._formsService.createProductVariantFormGroup();
        variantGroup.patchValue(variant);

        (variant?.availabilities || []).forEach((availability): void => {
          const availabilityGroup = this._formsService.createProductAvailabilityFormGroup();
          availabilityGroup.patchValue(availability);
          (variantGroup.controls.availabilities as FormArray).push(
            availabilityGroup,
          );
        });

        (this.dialogForm?.controls._variantArr as FormArray).push(variantGroup);
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
    if (this.dialogForm?.valid) {
      const value = {
        ...this.dialogForm?.value,
        variants: {},
      };

      value._variantArr.map((variant: IProductVariant): void => {
        value.variants[variant.id || ''] = fp.omit('id', variant);
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
              this._selectedGroupId || '',
              this.product.id,
              value,
            );
            break;
          case EProductLevel.UNIT:
            updatePromise = this._dataService.updateUnitProduct(
              this._selectedUnitId || '',
              this.product.id,
              value,
            );
            break;
          default:
            break;
        }

        if (updatePromise) {
          updatePromise.then(
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
        }
      } else {
        let insertPromise;

        // Set extends path on insert
        value.extends = this._generateExtendsPath();

        switch (this.productLevel) {
          case EProductLevel.GROUP:
            insertPromise = this._dataService.insertGroupProduct(
              this._selectedGroupId || '',
              value,
            );
            break;
          case EProductLevel.UNIT:
            insertPromise = this._dataService.insertUnitProduct(
              this._selectedUnitId || '',
              value,
            );
            break;
          default:
            break;
        }

        if (insertPromise) {
          insertPromise.then(
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
  }

  private _generateExtendsPath(): string | null {
    switch (this.productLevel) {
      case EProductLevel.GROUP:
        return `products/chains/${this._selectedChainId}/${this.product.id}`;
      case EProductLevel.UNIT:
        return `products/groups/${this._selectedGroupId}/${this.product.id}`;
      default:
        return null;
        break;
    }
  }
}
