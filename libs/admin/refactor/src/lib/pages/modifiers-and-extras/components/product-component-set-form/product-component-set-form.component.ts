import { combineLatest, iif, Observable, of } from 'rxjs';
import { startWith, switchMap, take, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnInit,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { ProductComponentSet, ProductComponentSetType } from '@bgap/domain';
import { KeyValue, KeyValueObject, UpsertResponse } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';

import { AbstractFormDialogComponent } from '../../../../shared/forms';
import {
  getProductComponentObject,
  getProductComponentOptions,
  SERVING_MODES,
} from '../../../../shared/utils';
import { unitsSelectors } from '../../../../store/units';
import { loggedUserSelectors } from '../../../../store/logged-user';
import { ProductComponentCollectionService } from '../../../../store/product-components';
import { productComponentSetTypeOptions } from '../../const';
import { ModifiersAndExtrasFormService } from '../../services/modifiers-and-extras-form.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-component-set-form',
  templateUrl: './product-component-set-form.component.html',
})
export class ProductComponentSetFormComponent
  extends AbstractFormDialogComponent
  implements OnInit
{
  public componentForm?: FormGroup;
  public productComponentSet!: ProductComponentSet;
  public unitOptions$: Observable<KeyValue[]>;
  public typeOptions: KeyValue[] = [];
  public productComponentOptions: KeyValue[] = [];
  public productComponentObject: KeyValueObject = {};
  public eProductComponentSetType = ProductComponentSetType;
  public servingModes = SERVING_MODES;
  public editing = false;

  constructor(
    protected override _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
    private _modifiersAndExtrasFormService: ModifiersAndExtrasFormService,
    private _productComponentCollectionService: ProductComponentCollectionService,
  ) {
    super(_injector);

    this.dialogForm =
      this._modifiersAndExtrasFormService.createProductComponentSetFormGroup();

    this.unitOptions$ = this._store.select(unitsSelectors.getAllUnitOptions());

    this.componentForm = this._formBuilder.group({
      productComponentId: ['', [Validators.required]],
    });

    this.typeOptions = productComponentSetTypeOptions;
  }

  ngOnInit() {
    if (this.productComponentSet) {
      this.dialogForm?.patchValue(cleanObject(this.productComponentSet));
    } else {
      // Patch unitId
      this._store
        .pipe(select(loggedUserSelectors.getSelectedUnitId), take(1))
        .subscribe();
    }

    combineLatest([
      this._productComponentCollectionService.filteredEntities$,
      iif(
        () => typeof this.dialogForm !== 'undefined',
        this.dialogForm?.controls['items'].valueChanges.pipe(
          startWith(this.dialogForm?.value.items || []),
        ),
        of([]),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(([productComponents, items]) => {
        this.productComponentOptions = getProductComponentOptions(
          productComponents,
          items,
        );
        this.productComponentObject =
          getProductComponentObject(productComponents);

        this._changeDetectorRef.markForCheck();
      });

    this._changeDetectorRef.detectChanges();
  }

  public addComponentToList() {
    if (this.dialogForm && this.componentForm) {
      this._modifiersAndExtrasFormService.addComponentToList(
        this.dialogForm,
        this.componentForm,
      );
    }
  }

  public removeComponentFromList(productComponentId: string) {
    if (this.dialogForm) {
      this._modifiersAndExtrasFormService.removeComponentFromList(
        this.dialogForm,
        productComponentId,
      );
    }
  }

  public move(idx: number, change: number) {
    const componentIdsArr: string[] = this.dialogForm?.controls['items'].value;
    const itemId = componentIdsArr[idx];

    componentIdsArr.splice(idx, 1);
    componentIdsArr.splice(idx + change, 0, itemId);
  }

  public submit() {
    if (this.dialogForm?.valid) {
      this.setWorking$(true)
        .pipe(
          switchMap(() =>
            this._modifiersAndExtrasFormService.saveComponentSetForm$(
              {
                ...this.dialogForm?.value,
                maxSelection:
                  this.dialogForm?.value.type ===
                  ProductComponentSetType.modifier
                    ? null
                    : this.dialogForm?.value.maxSelection,
                dirty: this.productComponentSet?.dirty ? false : undefined,
              },
              this.productComponentSet?.id,
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
