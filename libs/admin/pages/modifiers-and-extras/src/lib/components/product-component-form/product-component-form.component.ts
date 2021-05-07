import { NGXLogger } from 'ngx-logger';
import { take } from 'rxjs/operators';

import { ChangeDetectionStrategy, ChangeDetectorRef, Component, Injector, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { chainsSelectors } from '@bgap/admin/shared/data-access/chains';
import { AmplifyDataService } from '@bgap/admin/shared/data-access/data';
import { loggedUserSelectors } from '@bgap/admin/shared/data-access/logged-user';
import { productComponentsSelectors } from '@bgap/admin/shared/data-access/product-components';
import { AbstractFormDialogComponent } from '@bgap/admin/shared/forms';
import { EToasterType, multiLangValidator } from '@bgap/admin/shared/utils';
import { IChain, IGroup, IKeyValue, IProductComponent } from '@bgap/shared/types';
import { cleanObject } from '@bgap/shared/utils';
import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';
import { select, Store } from '@ngrx/store';

@UntilDestroy()
@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'bgap-product-component-form',
  templateUrl: './product-component-form.component.html',
})
export class ProductComponentFormComponent
  extends AbstractFormDialogComponent
  implements OnInit, OnDestroy {
  public productComponent!: IProductComponent;
  public chainOptions: IKeyValue[] = [];

  private _productComponents: IProductComponent[] = [];

  constructor(
    protected _injector: Injector,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    private _store: Store<any>,
    private _changeDetectorRef: ChangeDetectorRef,
    private _amplifyDataService: AmplifyDataService,
    private _logger: NGXLogger,
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
      .subscribe((productComponents: IProductComponent[]): void => {
        this._productComponents = productComponents;
      });
  }

  ngOnInit(): void {
    if (this.productComponent) {
      this.dialogForm.patchValue(
        cleanObject(this.productComponent),
      );
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
      .subscribe((chains: IChain[]): void => {
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

  private _uniqueNameValidator(lang: string): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const names = this._productComponents
        .filter(c => c.id !== this.productComponent?.id)
        .map(c => c.name[lang]);

      return names.includes(control.value) ? { existing: true } : null;
    };
  }

  public async submit(): Promise<void> {
    if (this.dialogForm?.valid) {
      if (this.productComponent?.id) {
        try {
          await this._amplifyDataService.update<IGroup>(
            'getProductComponent',
            'updateProductComponent',
            this.productComponent.id,
            () => this.dialogForm.value,
          );

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.updateSuccessful',
          );

          this.close();
        } catch (error) {
          this._logger.error(
            `PRODUCT COMPONENT UPDATE ERROR: ${JSON.stringify(error)}`,
          );
        }
      } else {
        try {
          await this._amplifyDataService.create(
            'createProductComponent',
            this.dialogForm?.value,
          );

          this._toasterService.show(
            EToasterType.SUCCESS,
            '',
            'common.insertSuccessful',
          );
          this.close();
        } catch (error) {
          this._logger.error(
            `PRODUCT COMPONENT INSERT ERROR: ${JSON.stringify(error)}`,
          );
        }
      }
    }
  }
}
