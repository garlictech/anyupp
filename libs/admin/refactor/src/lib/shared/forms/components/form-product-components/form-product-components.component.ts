import { combineLatest, iif, of } from 'rxjs';
import { startWith, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ProductComponentSetCollectionService } from '../../../../store/product-component-sets';
import { LocalizePipe } from '../../../../shared/pipes';
import * as CrudApi from '@bgap/crud-gql/api';
import { EProductLevel, KeyValue } from '@bgap/shared/types';
import { customNumberCompare } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import { FormsService } from '../../services/forms/forms.service';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-form-product-components',
  templateUrl: './form-product-components.component.html',
  styleUrls: ['./form-product-components.component.scss'],
})
export class FormProductComponentsComponent implements OnInit {
  @Input() componentFormArray?: FormArray;
  @Input() productLevel!: EProductLevel;
  @Input() currency?: string;
  public eProductLevel = EProductLevel;
  public eServingMode = CrudApi.ServingMode;

  public componentSetForm?: FormGroup;
  public productComponentSetOptions: KeyValue[] = [];

  private _productComponentSets: CrudApi.ProductComponentSet[] = [];

  constructor(
    private _formBuilder: FormBuilder,
    private _formsService: FormsService,
    private _localizePipe: LocalizePipe,
    private _changeDetectorRef: ChangeDetectorRef,
    private _productComponentSetCollectionService: ProductComponentSetCollectionService,
  ) {
    this.componentSetForm = this._formBuilder.group({
      productComponentSetId: ['', [Validators.required]],
    });
  }

  ngOnInit() {
    combineLatest([
      this._productComponentSetCollectionService.filteredEntities$.pipe(
        take(1),
      ),
      iif(
        () => typeof this.componentFormArray !== 'undefined',
        this.componentFormArray?.valueChanges.pipe(
          startWith(this.componentFormArray?.value || []),
        ),
        of([]),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([productComponentSets, items]: [
          CrudApi.ProductComponentSet[],
          CrudApi.ProductConfigSet[],
        ]) => {
          this._productComponentSets = productComponentSets;
          this.productComponentSetOptions = this._getProductComponentSetOptions(
            productComponentSets,
            items.map(i => i.productSetId),
          );

          this._changeDetectorRef.markForCheck();
        },
      );
  }

  public addComponentSetToList() {
    const componentSet = this._productComponentSets.find(
      c => c.id === this.componentSetForm?.value.productComponentSetId,
    );

    if (componentSet) {
      const componentSetGroup =
        this._formsService.createProductConfigSetFormGroup();
      componentSetGroup.patchValue({
        productSetId: componentSet.id,
        position: this.componentFormArray?.value.length + 1,
      });

      componentSet.items.forEach((componentId, i) => {
        const itemGroup =
          this._formsService.createProductConfigSetItemFormGroup();
        itemGroup.patchValue({
          productComponentId: componentId,
          position: i + 1,
        });
        (componentSetGroup.controls.items as FormArray).push(itemGroup);
      });

      (<FormArray>this.componentFormArray)?.push(componentSetGroup);

      this.componentSetForm?.patchValue({ productComponentSetId: '' });
    }

    this._changeDetectorRef.detectChanges();
  }

  public removeComponentSetFromList(idx: number) {
    (<FormArray>this.componentFormArray)?.removeAt(idx);

    (<FormArray>this.componentFormArray)?.controls.forEach(
      (g: AbstractControl, i: number) => {
        g.patchValue({ position: i + 1 });
      },
    );

    this._changeDetectorRef.detectChanges();
  }

  public move(idx: number, change: number) {
    const arr = this.componentFormArray?.value;
    const movingItem = arr[idx];

    if (
      (idx >= 0 && change === 1 && idx < arr.length - 1) ||
      (change === -1 && idx > 0)
    ) {
      arr.splice(idx, 1);
      arr.splice(idx + change, 0, movingItem);
      arr.forEach((componentSet: CrudApi.ProductConfigSet, pos: number) => {
        componentSet.position = pos + 1;
      });

      arr.sort(customNumberCompare('position'));

      (<FormArray>this.componentFormArray)?.controls.forEach(
        (g: AbstractControl, i: number) => {
          g.patchValue(arr[i]);
          (g.get('items') as FormArray).clear();

          (arr[i]?.items || []).forEach(
            (item: CrudApi.ProductConfigComponent) => {
              const itemGroup =
                this._formsService.createProductConfigSetItemFormGroup();
              itemGroup.patchValue(item);

              (g.get('items') as FormArray).push(itemGroup);
            },
          );
        },
      );
    }

    this._changeDetectorRef.detectChanges();
  }

  private _getProductComponentSetOptions(
    productComponentSets: CrudApi.ProductComponentSet[],
    items: string[],
  ) {
    return productComponentSets
      .filter(
        productComponentSet => !(items || []).includes(productComponentSet.id),
      )
      .map(
        (productComponentSet): KeyValue => ({
          key: productComponentSet.id,
          value: `${this._localizePipe.transform(productComponentSet.name)} (${
            productComponentSet.description
          })`,
        }),
      );
  }

  public hasServingMode(
    compSet: CrudApi.ProductComponentSet,
    servingMode: CrudApi.ServingMode,
  ) {
    return (compSet.supportedServingModes || []).includes(servingMode);
  }
}
