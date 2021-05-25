import { combineLatest } from 'rxjs';
import { startWith } from 'rxjs/operators';
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { productComponentSetsSelectors } from '@bgap/admin/shared/data-access/product-component-sets';
import { getProductComponentSetOptions } from '@bgap/admin/shared/utils';
import { EProductLevel, IKeyValue } from '@bgap/shared/types';
import { customNumberCompare } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';
import { FormsService } from '../../services/forms/forms.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-product-components',
  templateUrl: './form-product-components.component.html',
})
export class FormProductComponentsComponent implements OnInit, OnDestroy {
  @Input() componentFormArray!: FormArray;
  @Input() productLevel!: EProductLevel;
  @Input() currency?: string;
  public eProductLevel = EProductLevel;

  public componentSetForm!: FormGroup;
  public productComponentSetOptions: IKeyValue[] = [];

  private _productComponentSets: CrudApi.ProductComponentSet[] = [];

  constructor(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store,
    private _formBuilder: FormBuilder,
    private _formsService: FormsService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    this.componentSetForm = this._formBuilder.group({
      productComponentSetId: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    combineLatest([
      this._store.pipe(
        select(productComponentSetsSelectors.getAllProductComponentSets),
      ),
      this.componentFormArray.valueChanges.pipe(
        startWith(this.componentFormArray.value || []),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([productComponentSets, items]: [
          CrudApi.ProductComponentSet[],
          CrudApi.ProductConfigSet[],
        ]): void => {
          this._productComponentSets = productComponentSets;
          this.productComponentSetOptions = getProductComponentSetOptions(
            productComponentSets,
            items.map(i => i.productSetId),
          );

          this._changeDetectorRef.markForCheck();
        },
      );
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addComponentSetToList() {
    const componentSet = this._productComponentSets.find(
      c => c.id === this.componentSetForm.value.productComponentSetId,
    );

    if (componentSet) {
      const componentSetGroup = this._formsService.createProductConfigSetFormGroup();
      componentSetGroup.patchValue({
        productSetId: componentSet.id,
        position: this.componentFormArray.value.length + 1,
      });

      componentSet.items.forEach((componentId, i) => {
        const itemGroup = this._formsService.createProductConfigSetItemFormGroup(
          this.productLevel,
        );
        itemGroup.patchValue({
          productComponentId: componentId,
          position: i + 1,
        });
        (componentSetGroup.controls.items as FormArray).push(itemGroup);
      });

      (<FormArray>this.componentFormArray)?.push(componentSetGroup);

      this.componentSetForm.patchValue({ productComponentSetId: '' });
    }

    this._changeDetectorRef.detectChanges();
  }

  public removeComponentSetFromList(idx: number) {
    (<FormArray>this.componentFormArray)?.removeAt(idx);

    (<FormArray>this.componentFormArray)?.controls.forEach(
      (g: AbstractControl, i: number): void => {
        g.patchValue({ position: i + 1 });
      },
    );

    this._changeDetectorRef.detectChanges();
  }

  public move(idx: number, change: number): void {
    const arr = this.componentFormArray?.value;
    const movingItem = arr[idx];

    if (
      (idx >= 0 && change === 1 && idx < arr.length - 1) ||
      (change === -1 && idx > 0)
    ) {
      arr.splice(idx, 1);
      arr.splice(idx + change, 0, movingItem);
      arr.forEach(
        (componentSet: CrudApi.ProductConfigSet, pos: number): void => {
          componentSet.position = pos + 1;
        },
      );

      arr.sort(customNumberCompare('position'));

      (<FormArray>this.componentFormArray)?.controls.forEach(
        (g: AbstractControl, i: number): void => {
          g.patchValue(arr[i]);
          (g.get('items') as FormArray).clear();

          (arr[i]?.items || []).forEach(
            (item: CrudApi.ProductConfigComponent): void => {
              const itemGroup = this._formsService.createProductConfigSetItemFormGroup(
                this.productLevel,
              );
              itemGroup.patchValue(item);

              (g.get('items') as FormArray).push(itemGroup);
            },
          );
        },
      );
    }

    this._changeDetectorRef.detectChanges();
  }
}
