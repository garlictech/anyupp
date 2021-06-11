import { combineLatest } from 'rxjs';
import { startWith, take } from 'rxjs/operators';

import { CrudSdkService } from '@bgap/admin/shared/data-access/data';
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
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import {
  catchGqlError,
  EToasterType,
  getProductComponentObject,
  getProductComponentOptions,
  maxSelectionValidator,
  multiLangValidator,
} from '@bgap/admin/shared/utils';
import {
  EProductComponentSetType,
  IKeyValue,
  IKeyValueObject,
} from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';

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
  public chainOptions: IKeyValue[] = [];
  public typeOptions: IKeyValue[] = [];
  public productComponentOptions: IKeyValue[] = [];
  public productComponentObject: IKeyValueObject = {};
  public eProductComponentSetType = EProductComponentSetType;

  constructor(
    protected _injector: Injector,
    private _crudSdk: CrudSdkService,
    private _store: Store,
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
          (chain): IKeyValue => ({
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
    if (this.dialogForm?.valid) {
      const value = this.dialogForm.value;

      if (this.dialogForm.value.type === EProductComponentSetType.MODIFIER) {
        value.maxSelection = null;
      }

      if (this.productComponentSet?.id) {
        this._crudSdk.sdk
          .UpdateProductComponentSet({
            input: {
              id: this.productComponentSet.id,
              ...value,
            },
          })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.updateSuccessful',
            );

            this.close();
          });
      } else {
        this._crudSdk.sdk
          .CreateProductComponentSet({ input: value })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.show(
              EToasterType.SUCCESS,
              '',
              'common.insertSuccessful',
            );
            this.close();
          });
      }
    }
  }
}
