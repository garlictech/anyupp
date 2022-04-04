import { cloneDeep } from 'lodash/fp';
import { Observable } from 'rxjs';
import { switchMap, take, tap } from 'rxjs/operators';

import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  Injector,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';
import { chainsSelectors } from '@bgap/admin/store/chains';
import { loggedUserSelectors } from '@bgap/admin/store/logged-user';
import { productComponentsSelectors } from '@bgap/admin/store/product-components';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import * as CrudApi from '@bgap/crud-gql/api';
import { KeyValue, UpsertResponse } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select } from '@ngrx/store';

import { ModifiersAndExtrasFormService } from '../../services/modifiers-and-extras-form.service';

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
  public chainOptions$: Observable<KeyValue[]>;

  private _productComponents: CrudApi.ProductComponent[] = [];

  constructor(
    protected _injector: Injector,
    private _changeDetectorRef: ChangeDetectorRef,
    private _modifiersAndExtrasFormService: ModifiersAndExtrasFormService,
  ) {
    super(_injector);

    this.dialogForm =
      this._modifiersAndExtrasFormService.createProductComponentFormGroup(
        this._uniqueNameValidator,
      );

    // Used for the validator
    this._store
      .pipe(
        select(productComponentsSelectors.getAllProductComponents),
        untilDestroyed(this),
      )
      .subscribe((productComponents: CrudApi.ProductComponent[]): void => {
        this._productComponents = productComponents;
      });

    this.chainOptions$ = this._store.select(
      chainsSelectors.getAllChainOptions(),
    );
  }

  ngOnInit() {
    if (this.productComponent) {
      this.dialogForm?.patchValue(cleanObject(this.productComponent));
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

    this._changeDetectorRef.detectChanges();
  }

  ngOnDestroy(): void {
    // untilDestroyed uses it.
  }

  private _uniqueNameValidator =
    (lang: keyof CrudApi.LocalizedItem): ValidatorFn =>
    (control: AbstractControl): ValidationErrors | null =>
      this._productComponents
        .filter(
          c =>
            c.id !== this.productComponent?.id &&
            (c.name[lang] || '').trim() !== '',
        )
        .map(c => c.name[lang])
        .includes(control.value)
        ? { existing: true }
        : null;

  public submit() {
    if (this.dialogForm?.valid) {
      this.setWorking$(true)
        .pipe(
          switchMap(() =>
            this._modifiersAndExtrasFormService.saveComponentForm$(
              cloneDeep({
                ...this.dialogForm?.value,
                dirty: this.productComponent?.dirty ? false : undefined,
              }),
              this.productComponent?.id,
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
