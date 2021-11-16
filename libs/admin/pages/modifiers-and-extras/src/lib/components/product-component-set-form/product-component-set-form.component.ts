import { combineLatest, of } from 'rxjs';
import { startWith, take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productComponentsSelectors } from '@bgap/admin/shared/data-access/product-components';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  getProductComponentObject,
  getProductComponentOptions,
  maxSelectionValidator,
  multiLangValidator,
  notEmptyArray,
  SERVING_MODES,
} from '@bgap/admin/shared/utils';
import { catchGqlError } from '@bgap/admin/shared/data-access/app-core';
import * as CrudApi from '@bgap/crud-gql/api';
import {
  defaultServingMode,
  EProductComponentSetType,
  KeyValue,
  KeyValueObject,
} from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-component-set-form',
  templateUrl: './product-component-set-form.component.html',
})
export class ProductComponentSetFormComponent
  extends AbstractFormDialogComponent
  implements OnInit, OnDestroy
{
  public componentForm!: FormGroup;
  public productComponentSet!: CrudApi.ProductComponentSet;
  public chainOptions: KeyValue[] = [];
  public typeOptions: KeyValue[] = [];
  public productComponentOptions: KeyValue[] = [];
  public productComponentObject: KeyValueObject = {};
  public eProductComponentSetType = EProductComponentSetType;
  public servingModes = SERVING_MODES;
  public editing = false;

  constructor(
    protected _injector: Injector,
    private _crudSdk: CrudSdkService,
    private _changeDetectorRef: ChangeDetectorRef,
  ) {
    super(_injector);

    this.dialogForm = this._formBuilder.group(
      {
        chainId: ['', [Validators.required]],
        type: ['', [Validators.required]],
        maxSelection: [''],
        name: this._formBuilder.group(
          {
            hu: ['', [Validators.maxLength(40)]],
            en: ['', [Validators.maxLength(40)]],
            de: ['', [Validators.maxLength(40)]],
          },
          { validators: multiLangValidator },
        ),
        description: ['', [Validators.required]],
        supportedServingModes: [[defaultServingMode], [notEmptyArray]],
        items: [[]],
      },
      { validators: maxSelectionValidator },
    );

    this.componentForm = this._formBuilder.group({
      productComponentId: ['', [Validators.required]],
    });

    this.typeOptions = [
      {
        key: EProductComponentSetType.EXTRAS,
        value: 'productComponentSets.type.extras',
      },
      {
        key: EProductComponentSetType.MODIFIER,
        value: 'productComponentSets.type.modifier',
      },
    ];
  }

  ngOnInit(): void {
    if (this.productComponentSet) {
      this.dialogForm.patchValue(cleanObject(this.productComponentSet));
    } else {
      // Patch ChainId
      this._store
        .pipe(select(loggedUserSelectors.getSelectedChainId), take(1))
        .subscribe((selectedChainId: string | undefined | null): void => {
          if (selectedChainId) {
            this.dialogForm?.controls.chainId.patchValue(selectedChainId);
          }
        });
    }

    this._store
      .pipe(select(chainsSelectors.getAllChains), untilDestroyed(this))
      .subscribe((chains: CrudApi.Chain[]): void => {
        this.chainOptions = chains.map(
          (chain): KeyValue => ({
            key: chain.id,
            value: chain.name,
          }),
        );

        this._changeDetectorRef.detectChanges();
      });

    combineLatest([
      this._store.pipe(
        select(productComponentsSelectors.getAllProductComponents),
      ),
      this.dialogForm.controls['items'].valueChanges.pipe(
        startWith(this.dialogForm.value.items || []),
      ),
    ])
      .pipe(untilDestroyed(this))
      .subscribe(
        ([productComponents, items]: [
          CrudApi.ProductComponent[],
          string[],
        ]): void => {
          this.productComponentOptions = getProductComponentOptions(
            productComponents,
            items,
          );
          this.productComponentObject =
            getProductComponentObject(productComponents);

          this._changeDetectorRef.markForCheck();
        },
      );

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  public addComponentToList(): void {
    const componentIdsArr: string[] = this.dialogForm.controls['items'].value;
    componentIdsArr.push(this.componentForm.value.productComponentId);

    this.dialogForm.controls['items'].setValue(componentIdsArr);
    this.componentForm.patchValue({ productComponentId: '' });
  }

  public removeComponentFromList(productComponentId: string): void {
    const componentsArr: string[] = (
      this.dialogForm.controls['items'].value || []
    ).filter((i: string) => i !== productComponentId);

    this.dialogForm.controls['items'].setValue(componentsArr);
  }

  public move(idx: number, change: number) {
    const componentIdsArr: string[] = this.dialogForm.controls['items'].value;
    const itemId = componentIdsArr[idx];

    componentIdsArr.splice(idx, 1);
    componentIdsArr.splice(idx + change, 0, itemId);
  }

  public submit() {
    this._save().subscribe(() => {
      this._successAndClose(this.editing ? 'update' : 'inert');
    });
  }

  private _save() {
    if (this.dialogForm?.valid) {
      const value = this.dialogForm.value;

      if (this.dialogForm.value.type === EProductComponentSetType.MODIFIER) {
        value.maxSelection = null;
      }

      if (this.productComponentSet?.id) {
        return this._crudSdk.sdk
          .UpdateProductComponentSet({
            input: {
              id: this.productComponentSet.id,
              ...value,
            },
          })
          .pipe(catchGqlError(this._store));
      } else {
        return this._crudSdk.sdk
          .CreateProductComponentSet({ input: value })
          .pipe(catchGqlError(this._store));
      }
    }

    return of('Invalid');
  }

  private _successAndClose(key: string) {
    this._toasterService.showSimpleSuccess(`common.${key}Successful`);
    this.close();
  }
}
