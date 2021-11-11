import { take } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productComponentsSelectors } from '@bgap/admin/shared/data-access/product-components';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { multiLangValidator } from '@bgap/admin/shared/utils';
import { catchGqlError } from '@bgap/admin/shared/data-access/app-core';
import { IKeyValue } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';
import * as CrudApi from '@bgap/crud-gql/api';
import { CrudSdkService } from '@bgap/admin/shared/data-access/sdk';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-component-form',
  templateUrl: './product-component-form.component.html',
})
export class ProductComponentFormComponent
  extends AbstractFormDialogComponent
  implements OnInit, OnDestroy
{
  public productComponent!: CrudApi.ProductComponent;
  public chainOptions: IKeyValue[] = [];

  private _productComponents: CrudApi.ProductComponent[] = [];

  constructor(
    protected _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
    private _crudSdk: CrudSdkService,
  ) {
    super(_injector);

    this.dialogForm = this._formBuilder.group({
      chainId: ['', [Validators.required]],
      name: this._formBuilder.group(
        {
          hu: ['', [Validators.maxLength(40), this._uniqueNameValidator('hu')]],
          en: ['', [Validators.maxLength(40), this._uniqueNameValidator('en')]],
          de: ['', [Validators.maxLength(40), this._uniqueNameValidator('de')]],
        },
        { validators: multiLangValidator },
      ),
      description: [''],
      allergens: [[]],
    });

    // Used for the validator
    this._store
      .pipe(
        select(productComponentsSelectors.getAllProductComponents),
        untilDestroyed(this),
      )
      .subscribe((productComponents: CrudApi.ProductComponent[]): void => {
        this._productComponents = productComponents;
      });
  }

  ngOnInit(): void {
    if (this.productComponent) {
      this.dialogForm.patchValue(cleanObject(this.productComponent));
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

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _uniqueNameValidator(lang: keyof CrudApi.LocalizedItem): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const names = this._productComponents
        .filter(
          c =>
            c.id !== this.productComponent?.id &&
            (c.name[lang] || '').trim() !== '',
        )
        .map(c => c.name[lang]);

      return names.includes(control.value) ? { existing: true } : null;
    };
  }

  public submit() {
    if (this.dialogForm?.valid) {
      if (this.productComponent?.id) {
        this._crudSdk.sdk
          .UpdateProductComponent({
            input: {
              id: this.productComponent.id,
              ...this.dialogForm.value,
            },
          })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.showSimpleSuccess('common.updateSuccessful');

            this.close();
          });
      } else {
        this._crudSdk.sdk
          .CreateProductComponent({ input: this.dialogForm?.value })
          .pipe(catchGqlError(this._store))
          .subscribe(() => {
            this._toasterService.showSimpleSuccess('common.insertSuccessful');
            this.close();
          });
      }
    }
  }
}
